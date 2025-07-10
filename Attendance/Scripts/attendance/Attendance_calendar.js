$(document).ready(function () {
    let isDragging = false;
    let isSelecting = true;
    let selectedDays = new Set();
    let currentMonth = new Date().getMonth(); // 當前月份 (0~11)
    let currentYear = new Date().getFullYear(); // 當前年份

    // 初始化對話框
    $('#dialog').dialog({
        autoOpen: false, // 初始時不打開
        width: 600, // 設置寬度
        modal: true, // 模態對話框
        buttons: {
            Close: function () {
                $(this).dialog('close');
            }
        }
    });

    // 更新累積數據函數
    function updateMonthlySummary(user_id, year, month) {
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/getMonthlyAttendanceSummary?user_id=${user_id}&year=${year}&month=${month}`;

        // 請求取得當月累積數據
        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function (response) {
                // 更新累積數據顯示，使用小寫的屬性名
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

    // 顯示請假詳情的函數
    function showLeaveDetails(date, leaveRecords) {
        $('#dialog').empty(); // 清空對話框內容
        let html_infor = `<p><strong>日期：</strong> ${date}</p>`;
        html_infor += `<table class="table table-bordered table-striped">
            <thead class="thead-dark">
                <tr>
                    <th>姓名</th>
                    <th>請假類型</th>
                    <th>開始時間</th>
                    <th>結束時間</th>
                    <th>批准人</th>
                </tr>
            </thead>
            <tbody>`;
        leaveRecords.forEach(record => {
            html_infor += `<tr>
                <td>${record.userName}</td>
                <td>${record.leaveType}</td>
                <td>${record.startTime}</td>
                <td>${record.endTime}</td>
                <td>${record.approved_by}</td>
            </tr>`;
        });
        html_infor += `</tbody></table>`;
        $('#dialog').html(html_infor); // 設置對話框內容
        $('#dialog').dialog('open'); // 打開對話框
    }

    // 產生日曆的函數
    function generateCalendar(month, year) {
        $('#calendar').empty(); // 清空日曆容器

        let afterPurpleMap = {}; // <-- ✅ 加這行讓後續可存取紫光資訊
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const userid = getCookie("person_id");
        if (userid) { // 如果已登入
            const attendanceApiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDates?userid=${userid}&attendanceyear=${year}&attendancemonth=${month + 1}`;
            const leaveApiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_leave_record?userid=${userid}&startdate=${year}-${(month + 1).toString().padStart(2, '0')}-01&enddate=${year}-${(month + 1).toString().padStart(2, '0')}-${daysInMonth}`;

            // 請求出勤資料
            $.ajax({
                url: attendanceApiUrl,
                type: 'GET',
                success: function (attendanceResponse) {
                    const attendanceSet = new Set(attendanceResponse.map(r => r.attendanceDates));

                    // 請求請假資料
                    $.ajax({
                        url: leaveApiUrl,
                        type: 'GET',
                        success: function (leaveResponse) {
                            const leaveSet = new Map();
                            leaveResponse.forEach(leave => {
                                const leaveDate = leave.startTime.split('T')[0];
                                if (!leaveSet.has(leaveDate)) {
                                    leaveSet.set(leaveDate, []);
                                }
                                leaveSet.get(leaveDate).push(leave);
                            });

                            // 加入空白佔位符
                            for (let i = 0; i < firstDayOfMonth; i++) {
                                $('#calendar').append('<div class="day empty"></div>');
                            }

                            const username = getCookie('person_name');
                            for (let day = 1; day <= daysInMonth; day++) {
                                const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                const dayElement = $('<div>').addClass('day').text(day).data('day', formattedDate);

                                if (attendanceSet.has(formattedDate)) {
                                    const nameElement = $('<br><span>').text(username).addClass('clickable').on('click', function () {
                                        getAttendanceDetails(formattedDate);
                                    });
                                    dayElement.append(nameElement);
                                    dayElement.addClass('present').css('background-color', 'lightgreen');
                                }

                                if (leaveSet.has(formattedDate)) {
                                    const leaveElement = $('<br><span>').text('請假').addClass('clickable').on('click', function () {
                                        showLeaveDetails(formattedDate, leaveSet.get(formattedDate));
                                    });
                                    dayElement.append(leaveElement);
                                    dayElement.addClass('on-leave').css('background-color', 'lightcoral');
                                }

                                $('#calendar').append(dayElement);

                                // 為整個格子加入點擊事件（排除超連結）
                                dayElement.on('click', function (e) {
                                    if ($(e.target).hasClass('clickable') || $(e.target).hasClass('after-purple-check')) {
                                        return; // 點到姓名或紫色勾勾則跳過
                                    }

                                    if (!attendanceSet.has(formattedDate)) {
                                        return; // 如果沒出勤，不給補登記
                                    }

                                    const userId = getCookie("person_id");
                                    const userName = getCookie("person_name");

                                    if (afterPurpleMap[formattedDate]) {
                                        // 已登記，要取消
                                        if (confirm(`此日已登記為「晨下煉完紫光系」，是否要取消？`)) {
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
                                                    generateCalendar(currentMonth, currentYear); // 重新載入日曆
                                                },
                                                error: function (xhr) {
                                                    console.error(xhr);
                                                    alert("取消失敗，請稍後再試");
                                                }
                                            });
                                        }
                                    } else {
                                        // 尚未登記，要新增
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
                                                    alert("修練至紫光後資料更新成功");
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

                            // ✅✔️ 加在日曆格子產生完後，只跑一次的紫系判斷
                            const fullAttendanceUrl = `http://internal.hochi.org.tw:8082/api/attendance/getMonthlyAttendance?user_id=${userid}&year=${year}&month=${month + 1}`;
                            $.ajax({
                                url: fullAttendanceUrl,
                                type: 'GET',
                                success: function (fullResponse) {
                                    const afterPurpleMap = {};
                                    fullResponse.$values.forEach(record => {
                                        const dateKey = record.attendance_day.split('T')[0];
                                        afterPurpleMap[dateKey] = record.morning_light_down_after_purple_light === 1;
                                    });

                                    $('#calendar .day').each(function () {
                                        const date = $(this).data('day');
                                        if (afterPurpleMap[date] && $(this).find('.after-purple-check').length === 0) {
                                            $(this).append('<br><span class="after-purple-check" style="font-size: 20px; color: purple;">✔️</span>');
                                        }
                                    });
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
    }

    // 函數：通過API獲取出勤詳細資料
    function getAttendanceDetails(date) {
        $('#dialog').empty(); // 清空對話框內容
        const userid = getCookie('person_id');
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendance_record_by_date?userid=${userid}&attendanceDate=${date}`;

        // 請求取得詳細資料
        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function (detailResponse) {
                // 動態填充對話框內容
                let html_infor = `<p><strong>日期：</strong> ${date}</p>`;
                html_infor += `<table class="table table-bordered table-striped">
                    <thead class="thead-dark">
                        <tr>
                            <th>姓名</th>
                            <th>出勤狀態</th>
                            <th>打卡時間</th>
                        </tr>
                    </thead>
                    <tbody>`;
                if (detailResponse.length > 0) {
                    detailResponse.forEach(record => {
                        html_infor += `<tr>
                            <td>${record.user_name}</td>
                            <td>${record.attendance_status}</td>
                            <td>${record.create_time}</td>
                        </tr>`;
                    });
                }
                html_infor += `</tbody></table>`;
                $('#dialog').html(html_infor); // 設置對話框內容
                $('#dialog').dialog('open'); // 打開對話框
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

    // 上一個月份按鈕事件處理
    $('#prevMonth').on('click', function () {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        updateMonthLabel(); // 更新月份標籤
        generateCalendar(currentMonth, currentYear); // 產生日曆
    });

    // 下一個月份按鈕事件處理
    $('#nextMonth').on('click', function () {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        updateMonthLabel(); // 更新月份標籤
        generateCalendar(currentMonth, currentYear); // 產生日曆
    });

    // 初始化
    updateMonthLabel();
    generateCalendar(currentMonth, currentYear);
});

//取得cookie數值
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

// 創建或修改 cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "& expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "& path=/";
}

//刪除 cookie
function deleteCookie(name) {
    setCookie(name, "", -1);
}
