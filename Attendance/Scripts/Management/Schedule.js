$(document).ready(function () {
    let isDragging = false; // 是否正在拖曳
    let isSelecting = true; // 是否選取，與取消選取相反
    let selectedDays = new Set(); // 儲存選取的日期
    let currentMonth = new Date().getMonth(); // 當前月份
    let currentYear = new Date().getFullYear(); // 當前年份
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

        // 產生每一天的元素並加入日曆
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = $('<div>').addClass('day').text(i);
            dayElement.data('day', `${year}-${month + 1}-${i}`);
            dayElement.on('mousedown', startDrag); // 開始拖曳事件
            dayElement.on('mouseover', dragSelect); // 拖曳選取事件
            dayElement.on('mouseup', endDrag); // 結束拖曳事件
            $('#calendar').append(dayElement); // 將元素加入日曆
        }

        loadSelections(year, month + 1); // 加載已儲存的選取日期
    }

    // 更新月份標籤
    function updateMonthLabel() {
        const date = new Date(currentYear, currentMonth);
        const monthNames = date.toLocaleString('default', { month: 'long' }); // 取得月份名稱
        $('#monthLabel').text(`${monthNames} ${currentYear}`); // 更新顯示的月份標籤
    }

    // 全局鼠標事件設定
    $(document).on('mousedown', function () {
        isDragging = true; // 設定為拖曳狀態
    });

    $(document).on('mouseup', function () {
        isDragging = false; // 清除拖曳狀態
        startDay = null; // 拖曳結束後，清除開始日期
    });

    // 開始拖曳選擇範圍
    function startDrag(event) {
        const dayElement = $(event.target);
        const day = dayElement.data('day');
        startDay = day; // 記錄起始日
        isDragging = true;
        isSelecting = !dayElement.hasClass('selected'); // 判斷是選取還是取消選取
        toggleDay(dayElement, isSelecting); // 切換當前日期的選取狀態
    }

    // 拖曳過程中選取日期
    function dragSelect(event) {
        if (!isDragging || !startDay) return; // 若未拖曳或未設置起始日，直接返回

        const dayElement = $(event.target);
        const currentDay = dayElement.data('day');

        // 確定拖曳範圍內的日期
        const startIndex = Math.min(startDay.split('-')[2], currentDay.split('-')[2]);
        const endIndex = Math.max(startDay.split('-')[2], currentDay.split('-')[2]);

        for (let i = startIndex; i <= endIndex; i++) {
            const dayInRange = $(`[data-day="${currentYear}-${currentMonth + 1}-${i}"]`); // 獲取範圍內的日期元素
            toggleDay(dayInRange, isSelecting); // 切換選取狀態
        }
    }

    // 結束拖曳
    function endDrag() {
        isDragging = false; // 清除拖曳狀態
        startDay = null; // 清除起始日
    }

    // 切換單個日期選取狀態
    function toggleDay(dayElement, select) {
        const day = dayElement.data('day');

        if (select) {
            selectedDays.add(day); // 加入選取的日期
            dayElement.addClass('selected'); // 標記為選取
        } else {
            selectedDays.delete(day); // 刪除選取的日期
            dayElement.removeClass('selected'); // 標記為未選取
        }
    }

    // 使用API保存或更新選取的日期
    $('#saveButton').on('click', function () {
        if (selectedDays.size > 0) {
            let calendar_year = $('#monthLabel').text().split(' ')[1]; // 取得選取的年份
            let calendar_month = $('#monthLabel').text().split(' ')[0].replace("月", ""); // 取得選取的月份
            let attendance_days = Array.from(selectedDays).join(','); // 轉換為字串

            // 檢查該月份是否已經有儲存的選取日期
            let api_url_check = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDays?calendaryear=${calendar_year}&calendarmonth=${calendar_month}`;
            $.getJSON(api_url_check)
                .done(function (data) {
                    // 如果該月份的選取日期已存在，使用PUT請求更新
                    if (data.length > 0) {
                        updateAttendance(api_url_check, calendar_year, calendar_month, attendance_days);
                    } else {
                        // 如果該月份的選取日期不存在，使用POST請求儲存
                        appendAttendance(calendar_year, calendar_month, attendance_days);
                    }
                });
        }
    });

    // 使用PUT請求更新選取的日期
    function updateAttendance(api_url_check, calendar_year, calendar_month, attendance_days) {
        $.ajax({
            type: "PUT",
            url: "http://internal.hochi.org.tw:8082/api/attendance/update_attendance_calendar", // 更新的 Web API 的 URL
            data: JSON.stringify({
                "calendar_year": calendar_year,
                "calendar_month": calendar_month,
                "attendance_days": attendance_days
            }),
            crossDomain: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function () {
                alert('更新成功!'); // 提示更新成功
            },
            error: function (data) {
                console.log(data); // 錯誤處理
            }
        });
    }

    // 使用POST請求儲存選取的日期
    function appendAttendance(calendar_year, calendar_month, attendance_days) {
        $.ajax({
            type: "POST",
            url: "http://internal.hochi.org.tw:8082/api/attendance/appendattendance_calendar", // 儲存的 Web API 的 URL
            data: JSON.stringify({
                "calendar_year": calendar_year,
                "calendar_month": calendar_month,
                "attendance_days": attendance_days
            }),
            crossDomain: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function () {
                alert('上傳成功!'); // 提示上傳成功
            },
            error: function (data) {
                console.log(data); // 錯誤處理
            }
        });
    }

    // 從API加載儲存的選取日期
    function loadSelections(year, month) {
        selectedDays.clear(); // 清空已選取的日期
        let api_url = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDays?calendaryear=${year}&calendarmonth=${month}`;

        $.getJSON(api_url, { format: "json" })
            .done(function (data) {
                if (data.length > 0) {
                    let attendance_days = data[0].attendance_days.split(','); // 取得已儲存的選取日期
                    selectedDays = new Set(attendance_days); // 儲存已選取的日期
                    $('.day').each(function () {
                        const dayElement = $(this).data('day');
                        if (selectedDays.has(dayElement)) {
                            $(this).addClass('selected'); // 標記已選取的日期
                        }
                    });
                }
            });
    }

    // 月份切換邏輯
    $('#prevMonth').on('click', function () {
        if (currentMonth === 0) {
            currentMonth = 11; // 返回到前一年的12月
            currentYear--; // 年份減1
        } else {
            currentMonth--; // 月份減1
        }
        generateCalendar(currentMonth, currentYear); // 重新產生日曆
        updateMonthLabel(); // 更新月份標籤
    });

    $('#nextMonth').on('click', function () {
        if (currentMonth === 11) {
            currentMonth = 0; // 返回到下一年的1月
            currentYear++; // 年份加1
        } else {
            currentMonth++; // 月份加1
        }
        generateCalendar(currentMonth, currentYear); // 重新產生日曆
        updateMonthLabel(); // 更新月份標籤
    });

    // 初次載入日曆
    generateCalendar(currentMonth, currentYear);
    updateMonthLabel(); // 更新月份標籤
});
