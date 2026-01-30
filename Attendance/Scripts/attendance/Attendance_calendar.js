$(document).ready(function () {
    let isDragging = false;
    let isSelecting = true;
    let selectedDays = new Set();
    let currentMonth = new Date().getMonth(); // 當前月份 (0~11)
    let currentYear = new Date().getFullYear(); // 當前年份

    // 初始化對話框
    $('#dialog').dialog({
        autoOpen: false,
        width: 600,
        modal: true,
        buttons: {
            Close: function () {
                $(this).dialog('close');
            }
        }
    });

    // 更新累積數據函數
    function updateMonthlySummary(user_id, year, month) {
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/getMonthlyAttendanceSummary?user_id=${user_id}&year=${year}&month=${month}`;

        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function (response) {
                $('#morningLightUpTotal').text(response.totalMorningLightUp || 0);
                $('#morningLightDownTotal').text(response.totalMorningLightDown || 0);
                $('#morningMeetingTotal').text(response.totalMorningMeeting || 0);
                $('#morningLightDownAfterPurpleLightTotal').text(response.totalMorning_light_down_after_purple_light || 0);
            },
            error: function (error) {
                console.error('Error fetching monthly summary:', error);
                $('#morningLightUpTotal').text(0);
                $('#morningLightDownTotal').text(0);
                $('#morningMeetingTotal').text(0);
                $('#morningLightDownAfterPurpleLightTotal').text(0);
            }
        });
    }

    // 顯示請假詳情
    function showLeaveDetails(date, leaveRecords) {
        $('#dialog').empty();
        let html_infor = `<p><strong>日期：</strong> ${date}</p>`;
        html_infor += `
            <table class="table table-bordered table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>姓名</th>
                        <th>請假類型</th>
                        <th>開始時間</th>
                        <th>結束時間</th>
                        <th>批准人</th>
                    </tr>
                </thead>
                <tbody>
        `;

        leaveRecords.forEach(record => {
            html_infor += `
                <tr>
                    <td>${record.userName}</td>
                    <td>${record.leaveType}</td>
                    <td>${record.startTime}</td>
                    <td>${record.endTime}</td>
                    <td>${record.approved_by}</td>
                </tr>
            `;
        });

        html_infor += `</tbody></table>`;
        $('#dialog').html(html_infor);
        $('#dialog').dialog('open');
    }

    // 產生日曆
    function generateCalendar(month, year) {
        $('#calendar').empty();

        // ✅ 紫光狀態表：key=YYYY-MM-DD -> true/false
        let afterPurpleMap = {};

        // ✅ 上班日 Set：key=YYYY-MM-DD
        let workdaySet = new Set();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const userid = getCookie("person_id");
        if (!userid) return;

        // ✅ 先拿「上班日」(calendaryear / calendarmonth)
        const workdayApiUrl =
            `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDays?calendaryear=${year}&calendarmonth=${month + 1}`;

        const attendanceApiUrl =
            `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDates?userid=${userid}&attendanceyear=${year}&attendancemonth=${month + 1}`;

        const leaveApiUrl =
            `http://internal.hochi.org.tw:8082/api/attendance/get_leave_record?userid=${userid}` +
            `&startdate=${year}-${String(month + 1).padStart(2, '0')}-01` +
            `&enddate=${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

        // ✅ 工具：把 "2026-1-2" 轉成 "2026-01-02"
        function normalizeYMD(s) {
            if (!s) return "";
            s = s.toString().trim().split('T')[0].replaceAll('/', '-');
            const parts = s.split('-');
            if (parts.length < 3) return s;
            const y = parts[0];
            const m = String(parseInt(parts[1], 10)).padStart(2, '0');
            const d = String(parseInt(parts[2], 10)).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }

        // ✅ 渲染主流程（拿到 workdaySet 後才進來）
        function proceedRender(workdaySet) {

            // 先拿出勤
            $.ajax({
                url: attendanceApiUrl,
                type: 'GET',
                success: function (attendanceResponse) {

                    const attendanceSet = new Set(
                        (attendanceResponse || []).map(r => normalizeYMD(r.attendanceDates || ''))
                    );

                    // 再拿請假
                    $.ajax({
                        url: leaveApiUrl,
                        type: 'GET',
                        success: function (leaveResponse) {
                            const leaveSet = new Map();

                            const monthStart = new Date(year, month, 1);
                            const monthEnd = new Date(year, month, daysInMonth);

                            (leaveResponse || []).forEach(leave => {
                                const start = new Date(leave.startTime);
                                const end = new Date(leave.endTime);

                                let cur = new Date(Math.max(start.getTime(), monthStart.getTime()));
                                const last = new Date(Math.min(end.getTime(), monthEnd.getTime()));

                                while (cur.getTime() <= last.getTime()) {
                                    const y = cur.getFullYear();
                                    const m = String(cur.getMonth() + 1).padStart(2, '0');
                                    const d = String(cur.getDate()).padStart(2, '0');
                                    const leaveDateStr = `${y}-${m}-${d}`;

                                    if (!leaveSet.has(leaveDateStr)) leaveSet.set(leaveDateStr, []);
                                    leaveSet.get(leaveDateStr).push(leave);

                                    cur.setDate(cur.getDate() + 1);
                                }
                            });

                            // 先補空白
                            for (let i = 0; i < firstDayOfMonth; i++) {
                                $('#calendar').append('<div class="day empty"></div>');
                            }

                            const username = getCookie('person_name');

                            // 產生日曆格
                            for (let day = 1; day <= daysInMonth; day++) {

                                const formattedDate =
                                    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                                const isWorkday = workdaySet.has(formattedDate);

                                const dayElement = $('<div>')
                                    .addClass('day')
                                    .text(day)
                                    .data('day', formattedDate);

                                // ✅ 非上班日（先標 class，但不覆蓋出勤/請假顏色）
                                if (!isWorkday) {
                                    dayElement.addClass('non-workday');
                                }

                                // 出勤（綠）
                                if (attendanceSet.has(formattedDate)) {
                                    const nameElement = $('<br><span>')
                                        .text(username)
                                        .addClass('clickable')
                                        .on('click', function () {
                                            getAttendanceDetails(formattedDate);
                                        });

                                    dayElement.append(nameElement);
                                    dayElement.addClass('present').css('background-color', 'lightgreen');
                                }

                                // 請假（紅）
                                if (leaveSet.has(formattedDate)) {
                                    const leaveElement = $('<br><span>')
                                        .text('請假')
                                        .addClass('clickable')
                                        .on('click', function () {
                                            showLeaveDetails(formattedDate, leaveSet.get(formattedDate));
                                        });

                                    dayElement.append(leaveElement);
                                    dayElement.addClass('on-leave').css('background-color', 'lightcoral');
                                }

                                // ✅ 顯示文字「非上班日」：只在「沒有出勤、沒有請假」時顯示，避免資訊打架
                                if (!isWorkday && !attendanceSet.has(formattedDate) && !leaveSet.has(formattedDate)) {
                                    dayElement.append('<br><span class="non-workday-label">非上班日</span>');
                                }

                                $('#calendar').append(dayElement);

                                // ✅ 點整格：補登/取消 紫光（排除點到姓名/請假/✔️）
                                dayElement.on('click', function (e) {
                                    if ($(e.target).hasClass('clickable') || $(e.target).hasClass('after-purple-check')) {
                                        return;
                                    }

                                    // 沒出勤就不給補登
                                    if (!attendanceSet.has(formattedDate)) {
                                        return;
                                    }

                                    const userId = getCookie("person_id");
                                    const userName = getCookie("person_name");

                                    // 已登記 -> 取消
                                    if (afterPurpleMap[formattedDate]) {
                                        if (confirm('此日已登記為「晨下煉完紫光系」，是否要取消？')) {
                                            $.ajax({
                                                type: "POST",
                                                url: "http://internal.hochi.org.tw:8082/api/attendance/appendattendance_day",
                                                data: JSON.stringify({
                                                    user_id: userId,
                                                    user_name: userName,
                                                    attendance_day: formattedDate,
                                                    morning_light_down_after_purple_light: 0
                                                }),
                                                headers: {
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json'
                                                },
                                                success: function () {
                                                    alert("已取消紫光煉氣登記");
                                                    generateCalendar(currentMonth, currentYear);
                                                },
                                                error: function (xhr) {
                                                    console.error(xhr);
                                                    alert("取消失敗，請稍後再試");
                                                }
                                            });
                                        }
                                    } else {
                                        // 尚未登記 -> 新增
                                        if (confirm(`確定要補登記 ${formattedDate} 為「晨下煉完紫光系」？`)) {
                                            $.ajax({
                                                type: "POST",
                                                url: "http://internal.hochi.org.tw:8082/api/attendance/appendattendance_day",
                                                data: JSON.stringify({
                                                    user_id: userId,
                                                    user_name: userName,
                                                    attendance_day: formattedDate,
                                                    morning_light_down_after_purple_light: 1
                                                }),
                                                headers: {
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json'
                                                },
                                                success: function () {
                                                    alert("修煉至紫光後資料更新成功");
                                                    generateCalendar(currentMonth, currentYear);
                                                },
                                                error: function (xhr) {
                                                    console.error(xhr);
                                                    alert("更新失敗，請稍後再試");
                                                }
                                            });
                                        }
                                    }
                                });
                            }

                            // ✅✔️ 日曆格子都畫完後，查本月每日紫光狀態（只跑一次）
                            const fullAttendanceUrl =
                                `http://internal.hochi.org.tw:8082/api/attendance/getMonthlyAttendance?user_id=${userid}&year=${year}&month=${month + 1}`;

                            $.ajax({
                                url: fullAttendanceUrl,
                                type: 'GET',
                                success: function (fullResponse) {
                                    afterPurpleMap = {};

                                    const list = fullResponse && fullResponse.$values ? fullResponse.$values : (fullResponse || []);
                                    list.forEach(record => {
                                        const dateKey = normalizeYMD(record.attendance_day || '');
                                        afterPurpleMap[dateKey] = (record.morning_light_down_after_purple_light === 1);
                                    });

                                    // 把 ✔️ 貼回日曆
                                    $('#calendar .day').each(function () {
                                        const date = $(this).data('day');
                                        if (!date) return;

                                        if (afterPurpleMap[date] && $(this).find('.after-purple-check').length === 0) {
                                            $(this).append('<br><span class="after-purple-check" style="font-size: 20px; color: purple;">✔️</span>');
                                        }
                                    });

                                    updateMonthlySummary(userid, year, month + 1);
                                },
                                error: function (error) {
                                    console.error('Error fetching full attendance for ✔️:', error);
                                }
                            });
                        },
                        error: function (error) {
                            console.error('Error fetching leave data:', error);
                        }
                    });
                },
                error: function (error) {
                    console.error('Error fetching attendance data:', error);
                }
            });

            updateMonthlySummary(userid, year, month + 1);
        }
        // ✅ Step 1：呼叫上班日 API，建立 workdaySet
        $.ajax({
            url: workdayApiUrl,
            type: 'GET',
            success: function (resp) {
                try {
                    // resp 範例：[{ "$id":"1", "attendance_days":"2026-1-2,2026-1-9,..." }]
                    const first = (resp && resp.length) ? resp[0] : null;
                    const raw = first && first.attendance_days ? first.attendance_days : "";

                    workdaySet = new Set(
                        raw.split(',')
                            .map(x => normalizeYMD(x))
                            .filter(x => x)
                    );
                } catch (e) {
                    console.error('Parse workday response failed:', e);
                    workdaySet = new Set();
                }

                proceedRender(workdaySet);
            },
            error: function (err) {
                console.error('Error fetching workdays:', err);
                // 失敗就不標示非上班日（避免誤判）
                workdaySet = new Set();
                proceedRender(workdaySet);
            }
        });
    }

    // 取得出勤詳細資料
    function getAttendanceDetails(date) {
        $('#dialog').empty();

        const userid = getCookie('person_id');
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendance_record_by_date?userid=${userid}&attendanceDate=${date}`;

        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function (detailResponse) {
                let html_infor = `<p><strong>日期：</strong> ${date}</p>`;
                html_infor += `
                    <table class="table table-bordered table-striped">
                        <thead class="thead-dark">
                            <tr>
                                <th>姓名</th>
                                <th>出勤狀態</th>
                                <th>打卡時間</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                if (detailResponse && detailResponse.length > 0) {
                    detailResponse.forEach(record => {
                        html_infor += `
                            <tr>
                                <td>${record.user_name}</td>
                                <td>${record.attendance_status}</td>
                                <td>${record.create_time}</td>
                            </tr>
                        `;
                    });
                }

                html_infor += `</tbody></table>`;
                $('#dialog').html(html_infor);
                $('#dialog').dialog('open');
            },
            error: function (error) {
                console.error('Error fetching attendance details:', error);
            }
        });
    }

    // 更新月份標籤
    function updateMonthLabel() {
        const date = new Date(currentYear, currentMonth);
        const monthNames = date.toLocaleString('default', { month: 'long' });
        $('#monthLabel').text(`${monthNames} ${currentYear}`);
    }

    // 上一個月份
    $('#prevMonth').on('click', function () {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        updateMonthLabel();
        generateCalendar(currentMonth, currentYear);
    });

    // 下一個月份
    $('#nextMonth').on('click', function () {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        updateMonthLabel();
        generateCalendar(currentMonth, currentYear);
    });

    // 初始化
    updateMonthLabel();
    generateCalendar(currentMonth, currentYear);
});


// -------------------------
// Cookie helpers
// -------------------------

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(/&|;/);
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "& expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "& path=/";
}

function deleteCookie(name) {
    setCookie(name, "", -1);
}
