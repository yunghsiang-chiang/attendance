$(document).ready(function () {
    let isDragging = false;
    let isSelecting = true; // 是否選取，與取消選取相反
    let selectedDays = new Set();
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let startDay = null; // 用來記錄拖曳選擇的起始日

    // 產生日曆
    function generateCalendar(month, year) {
        $('#calendar').empty(); // 清空日曆

        // 計算該月第一天是星期幾
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 表示周日，1 表示周一，依此類推
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // 取得該月份的總天數

        // 在日曆上加入空白，直到第一天對應的星期
        for (let i = 0; i < firstDayOfMonth; i++) {
            $('#calendar').append('<div class="day empty"></div>'); // 用空白元素佔位
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = $('<div>').addClass('day').text(i);
            dayElement.data('day', `${year}-${month + 1}-${i}`);
            dayElement.on('mousedown', startDrag);
            dayElement.on('mouseover', dragSelect);
            dayElement.on('mouseup', endDrag);
            $('#calendar').append(dayElement);
        }

        loadSelections(year, month+1); // 加載已儲存的選取日期
    }

    // 更新月份標籤
    function updateMonthLabel() {
        const date = new Date(currentYear, currentMonth);
        const monthNames = date.toLocaleString('default', { month: 'long' });
        $('#monthLabel').text(`${monthNames} ${currentYear}`);
    }

    $(document).on('mousedown', function () {
        isDragging = true;
    });

    $(document).on('mouseup', function () {
        isDragging = false;
        startDay = null; // 拖曳結束後，清除開始日期
    });

    // 開始拖曳選擇範圍 
    function startDrag(event) {
        const dayElement = $(event.target);
        const day = dayElement.data('day');
        console.log(day);
        startDay = day; // 記錄起始日
        isDragging = true;
        isSelecting = !dayElement.hasClass('selected'); // 判斷是選取還是取消選取
        toggleDay(dayElement, isSelecting);
    }

    // 拖曳過程中選取日期
    function dragSelect(event) {
        if (!isDragging || !startDay) return;

        const dayElement = $(event.target);
        const currentDay = dayElement.data('day');

        if (startDay !== currentDay) {
            const startIndex = Math.min(startDay.split('-')[2], currentDay.split('-')[2]);
            const endIndex = Math.max(startDay.split('-')[2], currentDay.split('-')[2]);

            // 確定拖曳範圍內的日期
            for (let i = startIndex; i <= endIndex; i++) {
                const dayInRange = $(`[data-day="${currentYear}-${currentMonth}-${i}"]`);
                toggleDay(dayInRange, isSelecting);
            }
        }
    }

    // 結束拖曳
    function endDrag() {
        isDragging = false;
        startDay = null;
    }

    // 切換單個日期選取狀態
    function toggleDay(dayElement, select) {
        const day = dayElement.data('day');

        if (select) {
            if (!selectedDays.has(day)) {
                selectedDays.add(day);
                dayElement.addClass('selected');
            }
        } else {
            if (selectedDays.has(day)) {
                selectedDays.delete(day);
                dayElement.removeClass('selected');
            }
        }
    }

    // 使用API保存選取的日期
    $('#saveButton').on('click', function () {
        if (selectedDays.size > 0) {
            let calendar_year = $('#monthLabel').text().split(' ')[1];
            let calendar_month = $('#monthLabel').text().split(' ')[0].replace("月", "");
            let attendance_days = Array.from(selectedDays).join(',');
            $.ajax({
                type: "POST",
                url: "http://internal.hochi.org.tw:8082/api/attendance/appendattendance_calendar", // 目標 Web API 的 URL
                data: JSON.stringify({ // 將資料轉換為 JSON 字符串
                    "calendar_year": calendar_year,
                    "calendar_month": calendar_month,
                    "attendance_days": attendance_days
                }),
                crossDomain: true, // 啟用跨域請求
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                success: function (data) {
                    alert('上傳成功!');
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }
    });

    // 從API加載儲存的選取日期
    function loadSelections(year, month) {
        //清空selectedDays
        selectedDays.clear();
        //將單位資訊取得 並丟到cookie裡
        let api_url = "http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDays?calendaryear=" + year + "&calendarmonth=" + month;
        var myAPI = api_url;
        $.getJSON(myAPI, {
            format: "json"
        })
            .done(function (data) {
                if (data.length>0) {
                    let attendance_days = data[0].attendance_days.split(',');
                    selectedDays = new Set(attendance_days);
                    $('.day').each(function () {
                        // 針對每一個 class=day 元素執行操作
                        const dayElement = $(this).data('day');
                        if (selectedDays.has(dayElement)) {
                            $(this).addClass('selected');
                        }
                    });
                }
            });
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