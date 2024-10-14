// 當文件載入完畢後執行
$(document).ready(function () {
    // 將同修資訊載入下拉選單
    getPersonInformationToDropdownlist();

    // 搜尋按鈕事件綁定
    $("#search").click(function () {
        var isReady = false;
        var dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 格式的正則表達式

        // 檢查是否已選擇姓名，並且開始和結束日期的格式正確
        if ($('#name-select option:selected').val() != "" && dateRegex.test($('#start-date').val()) && dateRegex.test($('#end-date').val())) {
            isReady = true;
        }

        // 如果條件符合，則呼叫出勤資料搜尋功能
        if (isReady) {
            searchAttendanceRecord($('#name-select option:selected').val(), $('#start-date').val(), $('#end-date').val());
        }
    });
});

// 使用 async/await 將同修資訊載入下拉選單
async function getPersonInformationToDropdownlist() {
    let api_url = "http://internal.hochi.org.tw:8082/api/hochi_learners/get_person_IdName";

    try {
        // 使用 fetch API 進行請求，並等待結果
        const response = await fetch(api_url);
        const data = await response.json();

        // 動態生成下拉選單選項
        let unit = '';
        data.forEach(person => {
            unit += `<option value="${person.person_id}">${person.person_name}</option>`;
        });

        // 將生成的選項加入下拉選單
        $('#name-select').append(unit);
    } catch (error) {
        console.error('Error fetching person information:', error);
    }
}

// 使用 async/await 搜尋出勤資料
async function searchAttendanceRecord(userid, startdate, enddate) {
    $('#records-tbody').empty();
    $('#statistics-tbody').empty();
    $('#overtime-records-tbody').empty();
    $('#leave-records-tbody').empty();

    // 構建出勤紀錄 API 的 URL
    let attendanceApiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendance_record?userid=${userid}&startdate=${startdate}&enddate=${enddate}`;
    let leaveApiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_leave_record?userid=${userid}&startdate=${startdate}&enddate=${enddate}`;
    let overtimeApiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_overtime_record?userid=${userid}&startdate=${startdate}&enddate=${enddate}`;

    try {
        // 使用 Promise.all 同時獲取出勤、請假和加班資料，並等待結果
        const [attendanceResponse, leaveResponse,overtimeResponse] = await Promise.all([
            fetch(attendanceApiUrl),
            fetch(leaveApiUrl),
            fetch(overtimeApiUrl)
        ]);

        const attendanceData = await attendanceResponse.json();
        const leaveData = await leaveResponse.json();
        const overtimeData = await overtimeResponse.json();


        let isAttendanceEmpty = attendanceData.length === 0;
        let isLeaveEmpty = leaveData.length === 0;
        let isOvertimeEmpty = overtimeData.length === 0;

        if (isAttendanceEmpty) {
            $('#records').hide();
        } else {
        }
        if (attendanceData.length > 0) {
            let attendancedaysarray = new Set(); // 使用 Set 來儲存唯一的出勤日期
            let overtimehours = 0; // 加班小時數
            let leavehours = 0; // 事假小時數
            let special_vacation_hours = 0; // 特休小時數
            let sick_leave_hours = 0; // 病假小時數
            let compensatory_leave_hours = 0; // 補休小時數
            let menstrual_leave_hours = 0; // 生理假小時數

            let username = attendanceData[0].user_name; // 同修姓名

            let attendanceRows = '';

            // 迭代出勤資料，生成出勤表格的每一行
            attendanceData.forEach(record => {
                attendanceRows += `<tr><td>${record.user_name}</td><td>${record.attendance_status}</td><td>${record.create_time.replace('T', ' ')}</td></tr>`;

                // 如果狀態是 "到班"、"外出公務"，將日期加入到 Set 中
                if (record.attendance_status === '到班' || record.attendance_status === '外出公務') {
                    attendancedaysarray.add(record.create_time.split('T')[0]);
                }
            });
            // 將出勤紀錄插入到表格中
            $('#records-tbody').append(attendanceRows);


            let leaveRows = '';
            // 迭代請假資料，計算不同類型的假期時數
            leaveData.forEach(leaveRecord => {
                if (leaveRecord.leaveType === "事假") {
                    leavehours += leaveRecord.count_hours;
                } else if (leaveRecord.leaveType === "特休") {
                    special_vacation_hours += leaveRecord.count_hours;
                } else if (leaveRecord.leaveType === "補休") {
                    compensatory_leave_hours += leaveRecord.count_hours;
                } else if (leaveRecord.leaveType === "病假") {
                    sick_leave_hours += leaveRecord.count_hours;
                } else if (leaveRecord.leaveType === "生理假") {
                    menstrual_leave_hours += leaveRecord.count_hours;
                }
                leaveRows += `<tr><td>${leaveRecord.userName}</td><td>${leaveRecord.leaveType}</td><td>${leaveRecord.startTime.replace('T', ' ')}</td><td>${leaveRecord.endTime.replace('T', ' ')}</td><td>${leaveRecord.count_hours}</td></tr>`;
            });
            // 將請假紀錄插入到表格中
            $('#leave-records-tbody').append(leaveRows);
            
            let overtimeRows = '';
            // 迭代加班資料，計算不同類型的假期時數
            overtimeData.forEach(overtimeRecord => {
                if (overtimeRecord.overtimeType ==="加班") {
                    overtimehours += overtimeRecord.count_hours;
                }
                overtimeRows += `<tr><td>${overtimeRecord.userName}</td><td>${overtimeRecord.overtimeType}</td><td>${overtimeRecord.startTime.replace('T', ' ')}</td><td>${overtimeRecord.endTime.replace('T', ' ')}</td><td>${overtimeRecord.count_hours}</td></tr>`;
            });
            // 將加班紀錄插入到表格中
            $('#overtime-records-tbody').append(overtimeRows);

            // 將統計數據插入表格
            let statisticsRow = `<tr><td>${username}</td><td>${attendancedaysarray.size}</td><td>${overtimehours}</td><td>${leavehours}</td><td>${special_vacation_hours}</td><td>${sick_leave_hours}</td><td>${compensatory_leave_hours}</td><td>${menstrual_leave_hours}</td></tr>`;
            $('#statistics-tbody').append(statisticsRow);
        } else {
            console.log('No attendance data found for this user.');
        }
    } catch (error) {
        console.error('Error fetching attendance or leave data:', error);
    }
}
