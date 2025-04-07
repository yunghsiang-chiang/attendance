// 將當地時間轉換為 ISO 格式 (不轉換為 UTC)
function toLocalISOString(date) {
    if (!date || isNaN(date.getTime())) {
        return null; // 當日期無效時返回 null
    }
    const offset = date.getTimezoneOffset() * 60000; // 當前時區的偏移量，分鐘轉毫秒
    const localTime = new Date(date.getTime() - offset); // 減去偏移量來獲取當地時間
    return localTime.toISOString().slice(0, -1); // 去掉 'Z' 後的 ISO 格式
}

$(document).ready(function () {
    // 初始化員工下拉清單
    async function initializeEmployeeSelect() {
        const data = await $.get("http://internal.hochi.org.tw:8082/api/hochi_learners/get_person_IdName");
        data.forEach(item => {
            $('#employeeSelect').append(new Option(item.person_name, item.person_id));
        });
    }
    initializeEmployeeSelect();

    // 定義根據選擇的記錄類型顯示或隱藏欄位的函數
    function updateFormFields() {
        const type = $('#recordType').val();
        $('#attendanceStatus').toggle(type === 'attendance');
        $('#leaveTypeGroup').toggle(type === 'leave');
        $('#overtimeTypeGroup').toggle(type === 'overtime');
        $('#endTime').closest('.col-md-6').toggle(type !== 'attendance'); // 隱藏結束時間區域
    }

    // 當頁面載入時根據預設選項更新欄位顯示
    updateFormFields();

    // 綁定選擇改變事件以更新顯示
    $('#recordType').change(function () {
        updateFormFields();
    });

    // 取得 cookie 值
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

    // 查詢出勤記錄
    $('#queryBtn').click(async function () {
        const userId = $('#employeeSelect').val();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();

        if (userId && startDate && endDate) {
            $('#attendanceRecords').empty(); // 清空之前的查詢結果

            const apiConfigs = [
                {
                    url: `http://internal.hochi.org.tw:8082/api/attendance/get_attendance_record?userid=${userId}&startdate=${startDate}&enddate=${endDate}`,
                    type: '出勤',
                    showEndTime: false
                },
                {
                    url: `http://internal.hochi.org.tw:8082/api/attendance/get_leave_record?userid=${userId}&startdate=${startDate}&enddate=${endDate}`,
                    type: '請假',
                    showEndTime: true
                },
                {
                    url: `http://internal.hochi.org.tw:8082/api/attendance/get_overtime_record?userid=${userId}&startdate=${startDate}&enddate=${endDate}`,
                    type: '加班',
                    showEndTime: true
                }
            ];

            try {
                // 使用 Promise.all 同時發送請求
                const requests = apiConfigs.map(config => $.get(config.url));
                const results = await Promise.all(requests);
                // 加在 queryBtn 點擊事件內的 Promise.all() 後面
                const dayRecords = await $.get(`http://internal.hochi.org.tw:8082/api/attendance/get_attendance_day_record?user_id=${userId}&startDate=${startDate}&endDate=${endDate}`);
                displayMorningLightDown(dayRecords);

                // 根據返回的數據和配置顯示記錄
                results.forEach((data, index) => {
                    displayRecords(data, apiConfigs[index].type, apiConfigs[index].showEndTime);
                });
            } catch (error) {
                console.error("查詢出勤記錄時出現錯誤：", error);
                alert("查詢記錄失敗，請稍後重試");
            }
        }
    });

    // 顯示查詢結果
    function displayMorningLightDown(records) {
        const realRecords = records.$values || records;
        let content = `<h5>晨煉記錄（紫光後關燈）</h5>`;
        realRecords.forEach(record => {
            const status = record.morning_light_down_after_purple_light === 1 ? "✅" : "❌";
            content += `
            <p>
                日期: ${record.attendance_day}, 姓名: ${record.user_name}, 紫光後關燈: ${status}
                ${record.morning_light_down_after_purple_light === 1
                    ? `<button class="btn btn-link cancel-purple-light"
                          type="button"
                          data-user-id="${record.user_id}"
                          data-attendance-day="${record.attendance_day}">
                          取消紫光後關燈</button>`
                    : ''
                }
            </p>`;
        });
        $('#attendanceRecords').append(content);
    }


    // 顯示查詢結果並添加更新按鈕
    function displayRecords(records, recordType, showEndTime) {
        let content = `<h5>${recordType}記錄</h5>`;
        records.forEach(record => {
            const startTime = record.startTime || record.create_time;
            const endTime = record.endTime || ''; // 僅在有 endTime 時顯示時間
            const displayEndTime = showEndTime && endTime ? `, 結束時間: ${endTime}` : '';
            content += `
        <p>
            ${recordType}: ${record.attendance_status || record.leaveType || record.overtimeType}, 
            開始時間: ${startTime}${displayEndTime}
            <button type="button" class="btn btn-link update-record" 
                data-user-id="${record.user_id || record.userId || record.userID}" 
                data-user-name="${record.user_name || record.userName}" 
                data-attendance-status="${record.attendance_status}" 
                data-record-type="${recordType}" 
                data-start-time="${startTime}"
                data-end-time="${endTime}" 
                data-leave-type="${record.leaveType || ''}" 
                data-overtime-type="${record.overtimeType || ''}">更新</button>
            <button type="button" class="btn btn-link delete-record"
                data-user-id="${record.user_id || record.userId || record.userID}" 
                data-record-type="${recordType}" 
                data-start-time="${startTime}"
                data-attendance-status="${record.attendance_status || ''}"
                data-leave-type="${record.leaveType || ''}">刪除</button>
        </p>`;
        });
        $('#attendanceRecords').append(content);
    }

    // 新增出勤、請假或加班記錄
    $('#addRecordBtn').click(async function () {
        const userId = $('#employeeSelect').val();
        const userName = $('#employeeSelect option:selected').text();
        const recordType = $('#recordType').val();
        const startDateVal = $('#startTime').val();
        const endDateVal = $('#endTime').val();

        // 檢查必要欄位，只有在非出勤情況下檢查 endTime
        if (!startDateVal || (recordType !== 'attendance' && !endDateVal)) {
            alert("請輸入完整的開始和結束時間");
            return;
        }

        const startTime = toLocalISOString(new Date(startDateVal));
        const endTime = endDateVal ? toLocalISOString(new Date(endDateVal)) : null;
        const countHours = endTime ? (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60) : null;

        // 根據 API 規範設置不同的字段名稱
        let data = {
            submitted_at: toLocalISOString(new Date()),
            approved_by: getCookie("person_id")
        };

        try {
            if (recordType === 'attendance') {
                // 出勤記錄的 API 使用 user_id 和 user_name
                data.user_id = userId;
                data.user_name = userName;
                data.attendance_status = $('#attendanceStatus').val();
                data.create_time = startTime;
                await $.ajax({
                    url: "http://internal.hochi.org.tw:8082/api/attendance/appendattendance_record",
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function () {
                        alert("出勤記錄已新增");
                    },
                    error: function (error) {
                        console.error(error);
                        alert("新增記錄失敗，請檢查資料並重試");
                    }
                });
            } else if (recordType === 'leave') {
                // 請假記錄的 API 使用 userId 和 userName
                data.userId = userId;
                data.userName = userName;
                data.leaveType = $('#leaveType').val();
                data.startTime = startTime;
                data.endTime = endTime;
                data.count_hours = countHours;
                await $.ajax({
                    url: "http://internal.hochi.org.tw:8082/api/attendance/appendleave_record",
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function () {
                        alert("請假記錄已新增");
                    },
                    error: function (error) {
                        console.error(error);
                        alert("新增記錄失敗，請檢查資料並重試");
                    }
                });
            } else if (recordType === 'overtime') {
                // 加班記錄的 API 使用 userID 和 userName
                data.userID = userId;
                data.userName = userName;
                data.overtimeType = $('#overtimeType').val();
                data.startTime = startTime;
                data.endTime = endTime;
                data.count_hours = countHours;
                await $.ajax({
                    url: "http://internal.hochi.org.tw:8082/api/attendance/appendovetime_record",
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function () {
                        alert("加班記錄已新增");
                    },
                    error: function (error) {
                        console.error(error);
                        alert("新增記錄失敗，請檢查資料並重試");
                    }
                });
            }
        } catch (error) {
            console.error("發生錯誤：", error);
        }
    });

    // 更新按鈕事件綁定
    $(document).on('click', '.update-record', function () {
        const userId = $(this).data('user-id');
        const userName = $(this).data('user-name');
        const recordType = $(this).data('record-type');
        const startTime = $(this).data('start-time');
        const attendanceStatus = $(this).data('attendance-status') || '';
        const leaveType = $(this).data('leave-type') || '';
        const overtimeType = $(this).data('overtime-type') || '';
        const endTime = $(this).data('end-time');  // 確保這裡直接獲取字符串

        // 根據不同記錄類型顯示相應的更新欄位
        if (recordType === '出勤') {
            const newAttendanceStatus = prompt("輸入新的出勤狀態:", attendanceStatus);
            const newCreateTime = prompt("輸入新的開始時間 (格式 yyyy-MM-ddTHH:mm:ss):", startTime);

            if (newAttendanceStatus && newCreateTime) {
                updateAttendanceRecord(userId, attendanceStatus, startTime, newAttendanceStatus, newCreateTime, userName);
            }
        } else if (recordType === '請假') {
            const newLeaveType = prompt("輸入新的請假類型:", leaveType);
            const newStartTime = prompt("輸入新的開始時間 (格式 yyyy-MM-ddTHH:mm:ss):", startTime);
            const newEndTime = prompt("輸入新的結束時間 (格式 yyyy-MM-ddTHH:mm:ss):", endTime);
            const countHours = prompt("輸入更新後的總小時數:");

            if (newLeaveType && newStartTime && newEndTime && countHours) {
                updateLeaveRecord(userId, userName, leaveType, startTime, newLeaveType, newStartTime, newEndTime, countHours);
            }
        } else if (recordType === '加班') {
            const newStartTime = prompt("輸入新的開始時間 (格式 yyyy-MM-ddTHH:mm:ss):", startTime);
            const newEndTime = prompt("輸入新的結束時間 (格式 yyyy-MM-ddTHH:mm:ss):", endTime);
            const countHours = prompt("輸入更新後的總小時數:");

            if (newStartTime && newEndTime && countHours) {
                updateOvertimeRecord(userId, userName, startTime, overtimeType, newStartTime, newEndTime, countHours);
            }
        }
    });

    // 刪除按鈕事件綁定
    $(document).on('click', '.delete-record', function () {
        const userId = $(this).data('user-id');
        const recordType = $(this).data('record-type');
        const startTime = $(this).data('start-time');
        const attendanceStatus = $(this).data('attendance-status');
        const leaveType = $(this).data('leave-type');

        // 根據不同記錄類型選擇對應的刪除 API
        let deleteUrl;
        if (recordType === '出勤') {
            deleteUrl = `http://internal.hochi.org.tw:8082/api/attendance/delete-attendance-record/${encodeURIComponent(userId)}/${encodeURIComponent(attendanceStatus)}/${encodeURIComponent(startTime)}`;
        } else if (recordType === '請假') {
            deleteUrl = `http://internal.hochi.org.tw:8082/api/attendance/delete-leave-record/${encodeURIComponent(userId)}/${encodeURIComponent(leaveType)}/${encodeURIComponent(startTime)}`;
        } else if (recordType === '加班') {
            deleteUrl = `http://internal.hochi.org.tw:8082/api/attendance/delete-overtime-record/${encodeURIComponent(userId)}/${encodeURIComponent(startTime)}`;
        }

        if (deleteUrl) {
            // 發送 AJAX DELETE 請求
            $.ajax({
                url: deleteUrl,
                type: "DELETE",
                success: function () {
                    alert(`${recordType}記錄已刪除`);
                    $('#queryBtn').click(); // 刷新顯示
                },
                error: function (error) {
                    console.error("刪除記錄失敗：", error);
                    alert("刪除記錄失敗，請檢查資料並重試");
                }
            });
        }
    });

    // 更新出勤記錄的函數
    async function updateAttendanceRecord(userId, attendanceStatus, createTime, newAttendanceStatus, newCreateTime, userName) {
        const data = {
            user_id: userId.toString(),
            user_name: userName,
            attendance_status: newAttendanceStatus,
            create_time: newCreateTime
        };
        try {
            await $.ajax({
                url: `http://internal.hochi.org.tw:8082/api/attendance/update-attendance/${encodeURIComponent(userId)}/${encodeURIComponent(attendanceStatus)}/${encodeURIComponent(createTime)}`,
                type: "PUT",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function () {
                    alert("出勤記錄已更新");
                    $('#queryBtn').click(); // 刷新顯示
                },
                error: function (error) {
                    console.error("更新失敗：", error);
                    alert("更新記錄失敗，請檢查資料並重試");
                }
            });
        } catch (error) {
            console.error("發生錯誤：", error);
        }
    }

    // 更新請假記錄的函數
    async function updateLeaveRecord(userId, userName, oldLeaveType, oldStartTime, newLeaveType, newStartTime, newEndTime, countHours) {
        const data = {
            userId: userId.toString(),
            userName: userName,
            leaveType: newLeaveType,
            startTime: newStartTime,
            endTime: newEndTime,
            count_hours: parseFloat(countHours),
            submitted_at: toLocalISOString(new Date()),
            approved_by: getCookie("person_id")
        };
        try {
            await $.ajax({
                url: `http://internal.hochi.org.tw:8082/api/attendance/replace-leave-record/${encodeURIComponent(userId)}/${encodeURIComponent(oldLeaveType)}/${encodeURIComponent(oldStartTime)}`,
                type: "PUT",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function () {
                    alert("請假記錄已更新");
                    $('#queryBtn').click(); // 刷新顯示
                },
                error: function (error) {
                    console.error("請假記錄更新失敗：", error);
                    alert("請假記錄更新失敗，請檢查資料並重試");
                }
            });
        } catch (error) {
            console.error("發生錯誤：", error);
        }
    }

    // 更新加班記錄的函數
    async function updateOvertimeRecord(userId, userName, oldStartTime, overtimeType, newStartTime, newEndTime, countHours) {
        const data = {
            userID: userId.toString(),
            userName: userName,
            overtimeType: overtimeType,
            startTime: newStartTime,
            endTime: newEndTime,
            count_hours: parseFloat(countHours),
            submitted_at: toLocalISOString(new Date()),
            approved_by: getCookie("person_id")
        };
        try {
            await $.ajax({
                url: `http://internal.hochi.org.tw:8082/api/attendance/replace-overtime-record/${encodeURIComponent(userId)}/${encodeURIComponent(oldStartTime)}`,
                type: "PUT",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function () {
                    alert("加班記錄已更新");
                    $('#queryBtn').click(); // 刷新顯示
                },
                error: function (error) {
                    console.error("加班記錄更新失敗：", error);
                    alert("加班記錄更新失敗，請檢查資料並重試");
                }
            });
        } catch (error) {
            console.error("發生錯誤：", error);
        }
    }

    // 取消事件 取消 對應日期 修練至紫光
    $(document).on('click', '.cancel-purple-light', async function () {
        const userId = $(this).data('user-id');
        const attendanceDayRaw = $(this).data('attendance-day'); // e.g., "2025-04-01T00:00:00"

        // 直接取 yyyy-MM-dd 前 10 字元
        const attendanceDay = attendanceDayRaw.slice(0, 10);

        if (confirm(`確定要取消 ${attendanceDay} 的紫光後關燈紀錄？`)) {
            try {
                await $.ajax({
                    type: "PUT",
                    url: `http://internal.hochi.org.tw:8082/api/attendance/cancel-purple-light/${encodeURIComponent(userId)}/${encodeURIComponent(attendanceDay)}`,
                    success: function () {
                        alert("取消成功");
                        $('#queryBtn').click(); // 重新查詢
                    },
                    error: function (xhr) {
                        console.error(xhr);
                        alert("取消失敗，請稍後再試");
                    }
                });
            } catch (err) {
                console.error(err);
                alert("發生錯誤，請稍後再試");
            }
        }
    });


});

$(document).on('click', '#addRecordBtn', async function () {
    const userId = $('#employeeSelect').val();
    const userName = $('#employeeSelect option:selected').text();
    const selectedDate = $('#startTime').val();
    const purpleValue = $('#cb_morning_down_after_purple_light_update').prop('checked') ? 1 : 0;

    if (!selectedDate) {
        alert("請選擇日期");
        return;
    }

    try {
        await $.ajax({
            type: "POST",
            url: "http://internal.hochi.org.tw:8082/api/attendance/appendattendance_day",
            data: JSON.stringify({
                user_id: userId,
                user_name: userName,
                attendance_day: selectedDate,
                morning_light_down_after_purple_light: purpleValue
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function () {
                alert("紫光後關燈資料更新成功");
                $('#queryBtn').click();
            },
            error: function (xhr) {
                console.error(xhr);
                alert("更新失敗，請稍後再試");
            }
        });
    } catch (err) {
        console.error(err);
        alert("發生錯誤，請稍後再試");
    }
});
