$(document).ready(function () {
    let isDragging = false;
    let isSelecting = true;
    let selectedDays = new Set();
    let currentMonth = new Date().getMonth(); // 當前月份 (0~11)
    let currentYear = new Date().getFullYear(); // 當前年份

    // 更新累積數據函數
    function updateMonthlySummary(user_id, year, month) {
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/getMonthlyAttendanceSummary?user_id=${user_id}&year=${year}&month=${month}`;

        // 請求取得當月累積數據
        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function (response) {
                // 更新累積數據顯示
                $('#morningLightUpTotal').text(response.TotalMorningLightUp || 0);
                $('#morningLightDownTotal').text(response.TotalMorningLightDown || 0);
                $('#morningMeetingTotal').text(response.TotalMorningMeeting || 0);
            },
            error: function (error) {
                console.error('Error fetching monthly summary:', error);
                $('#morningLightUpTotal').text(0);
                $('#morningLightDownTotal').text(0);
                $('#morningMeetingTotal').text(0);
            }
        });
    }

    // 產生日曆的函數
    function generateCalendar(month, year) {
        $('#calendar').empty(); // 清空日曆容器

        // 初始化 jQuery UI dialog（隱藏）
        $("#dialog").dialog({
            autoOpen: false,
            modal: true,
            width: $(window).width() < 600 ? '90%' : 400, // 自動適應手機屏幕
            position: { my: "center", at: "center", of: window },
            open: function () {
                if ($(window).width() < 600) {
                    $(".ui-dialog").css({
                        top: 50, // 避免對話框貼近頂部
                        left: "5%", // 保證在手機屏幕上顯示
                        width: "90%" // 對話框寬度為手機屏幕的90%
                    });
                }
            }
        });

        // 計算該月第一天是星期幾
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // 計算該月的總天數
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const userid = getCookie("person_id");
        if (userid) { // 如果已登入
            const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDates?userid=${userid}&attendanceyear=${year}&attendancemonth=${month + 1}`;

            // 請求出勤資料
            $.ajax({
                url: apiUrl,
                type: 'GET',
                success: function (response) {
                    if (response.length > 0) { // 有出勤數據
                        // 建立一個 Set 來快速查找出勤日期
                        const attendanceSet = new Set(response.map(r => r.attendanceDates));

                        // 加入空白佔位符，直到對應的星期
                        for (let i = 0; i < firstDayOfMonth; i++) {
                            $('#calendar').append('<div class="day empty"></div>'); // 用空白元素佔位
                        }

                        const username = getCookie('person_name');
                        // 生成日曆的實際日期
                        for (let day = 1; day <= daysInMonth; day++) {
                            const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                            const dayElement = $('<div>').addClass('day').text(day).data('day', formattedDate);

                            // 檢查是否是出勤日期
                            if (attendanceSet.has(formattedDate)) {
                                // 顯示名字，並設置可點擊
                                const nameElement = $('<br><span>').text(username).addClass('clickable').on('click', function () {
                                    // 通過API獲取該日期的詳細出勤資料
                                    getAttendanceDetails(formattedDate);
                                });
                                dayElement.append(nameElement);
                                dayElement.addClass('present').css('background-color', 'lightgreen'); // 改變出勤日期的背景顏色
                            }

                            // 加入日曆
                            $('#calendar').append(dayElement);
                        }
                    }
                },
                error: function (error) {
                    console.error('Error fetching attendance data:', error);
                }
            });

            // 請求更新當月的累積數據
            updateMonthlySummary(userid, year, month + 1); // month 以 0 基準，所以加 1
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
                html_infor += `</tbody>
                </table>`;
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
