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

        // 計算該月第一天是星期幾
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // 取得該月份的天數

        if (getCookie("person_id") != '') { //如果登入!或是已經登入，登出 討取cookie會得到 '' 空字串
            const userid = getCookie("person_id");
            // API URL（假設有特定 endpoint 提供王大明的出勤資訊）
            const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDates?userid=` + userid + `&attendanceyear=` + year + `&attendancemonth=` + (month+1);

            // 使用API請求出勤資料
            $.ajax({
                url: apiUrl,
                type: 'GET',
                success: function (response) {
                    if (response.length>0) { //有數據

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
                                // 顯示使用者的名字
                                dayElement.append('<p><span>' + username +'</span></p>');

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