// 將當地時間轉換為 ISO 格式 (不轉換為 UTC)
function toLocalISOString(date) {
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
    function displayRecords(records, recordType, showEndTime) {
        let content = `<h5>${recordType}記錄</h5>`;
        records.forEach(record => {
            content += `<p>${recordType}: ${record.attendance_status || record.leaveType || record.overtimeType}, 開始時間: ${record.startTime || record.create_time}`;
            if (showEndTime && record.endTime) {
                content += `, 結束時間: ${record.endTime}`;
            }
            content += `</p>`;
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

        if (!startDateVal || !endDateVal) {
            alert("請輸入完整的開始和結束時間");
            return;
        }

        const startTime = toLocalISOString(new Date(startDateVal));
        const endTime = toLocalISOString(new Date(endDateVal));
        const countHours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);

        let data = {
            user_id: userId,
            user_name: userName,
            submitted_at: toLocalISOString(new Date()),
            approved_by: getCookie("person_id")
        };

        try {
            if (recordType === 'attendance') {
                data.attendance_status = $('#attendanceStatus').val();
                data.create_time = startTime;
                await $.ajax({
                    url: "http://internal.hochi.org.tw:8082/api/attendance/appendattendance_record",
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json", // 設定 Content-Type
                    success: function () {
                        alert("出勤記錄已新增");
                    },
                    error: function (error) {
                        console.error(error);
                        alert("新增記錄失敗，請檢查資料並重試");
                    }
                });
            } else if (recordType === 'leave') {
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


    // 控制顯示出勤/請假/加班類型選項
    $('#recordType').change(function () {
        const type = $(this).val();
        $('#attendanceStatus').toggle(type === 'attendance');
        $('#leaveTypeGroup').toggle(type === 'leave');
        $('#overtimeTypeGroup').toggle(type === 'overtime');
    }).trigger('change');
});
