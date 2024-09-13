$(document).ready(function () {
    let isDragging = false;
    let isSelecting = true; // 是否選取，與取消選取相反
    let selectedDays = new Set();
    let currentMonth = new Date().getMonth(); // ※ 0~11
    let currentYear = new Date().getFullYear();
    let startDay = null; // 用來記錄拖曳選擇的起始日

    // 產生日曆
    function generateCalendar(month, year) {
        $('#calendar').empty(); // 清空日曆

        // 初始化 jQuery UI dialog（隱藏）
        $("#dialog").dialog({
            autoOpen: false,
            modal: true,
            width: $(window).width() < 600 ? '90%' : 400, // 自動適應手機屏幕
            position: {
                my: "center",
                at: "center",
                of: window
            },
            open: function () {
                if ($(window).width() < 600) {
                    $(".ui-dialog").css({
                        top: 50,  // 避免對話框貼近頂部
                        left: "5%",  // 保證在手機屏幕上顯示
                        width: "90%" // 對話框寬度為手機屏幕的90%
                    });
                }
            }
        });

        // 計算該月第一天是星期幾
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // 取得該月份的天數

        if (getCookie("person_id") != '') { //如果登入!或是已經登入，登出 討取cookie會得到 '' 空字串
            const userid = getCookie("person_id");
            // API URL（假設有特定 endpoint 提供出勤資訊）
            const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDates?userid=` + userid + `&attendanceyear=` + year + `&attendancemonth=` + (month + 1);

            // 使用API請求出勤資料
            $.ajax({
                url: apiUrl,
                type: 'GET',
                success: function (response) {
                    if (response.length > 0) { //有數據

                        // 建立一個 Set，便於快速查找出勤日期
                        const attendanceSet = new Set();
                        for (var i = 0; i < response.length; i++) {
                            console.log(response[i].attendanceDates.length);
                            attendanceSet.add(response[i].attendanceDates)
                        }
                        // 先加入空白佔位符，直到對應的星期
                        for (let i = 0; i < firstDayOfMonth; i++) {
                            $('#calendar').append('<div class="day empty"></div>'); // 用空白元素佔位
                        }

                        const username = getCookie('person_name');
                        // 生成日曆的實際日期
                        for (let day = 1; day <= daysInMonth; day++) {
                            const formattedDate = `${year}-${(month + 1) < 10 ? '0' + (month + 1) : (month + 1)}-${day < 10 ? '0' + day : day}`;
                            const dayElement = $('<div>').addClass('day').text(day);
                            dayElement.data('day', formattedDate);

                            // 檢查是否是出勤日期
                            if (attendanceSet.has(formattedDate)) {
                                // 顯示名字，並設置可點擊
                                const nameElement = $('<br><span>' + username + '</span>').addClass('clickable');
                                // 點擊名字，彈出詳細資訊視窗
                                nameElement.on('click', function () {
                                    // 通過API獲取該日期的詳細出勤資料
                                    getAttendanceDetails(formattedDate);
                                });
                                // 顯示使用者的名字
                                dayElement.append(nameElement);
                                // 改變出勤日期的背景顏色
                                dayElement.addClass('present').css('background-color', 'lightgreen');
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
        }
    }

    // 函數：通過API獲取出勤詳細資料
    function getAttendanceDetails(date) {
        $('#dialog').empty(); // 出勤資訊
        var userid = getCookie('person_id');
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendance_record_by_date?userid=` + userid + `&attendanceDate=` + date;

        // 使用API請求取得詳細資料
        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function (detailResponse) {
                // 動態填充 dialog 的內容
                let html_infor = `<p><strong>日期：</strong> ${date}</p>`;
                html_infor += `<table class="table table-bordered table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>出勤狀態</th>
                        <th>打卡時間</th>
                        <th>下班時間</th>
                    </tr>
                </thead>
                <tbody>`;
                if (detailResponse.length>0) {
                    for (var i = 0; i < detailResponse.length;i++) {
                        html_infor += `<tr>
                                        <td>${detailResponse[i].user_name}</td>
                                        <td>${detailResponse[i].attendance_status}</td>
                                        <td>${detailResponse[i].create_time}</td>
                                    </tr>`;
                    }
                }
                html_infor += `</tbody>
                            </table>`;
                $('#dialog').append(html_infor);
                // 打開對話框
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


    // 月份切換邏輯
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

    // 初始化日曆
    updateMonthLabel();
    // 產生日曆
    generateCalendar(currentMonth, currentYear);
});

//取得cookie數值
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split('&'); //小心，這裡可能不同
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
};

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