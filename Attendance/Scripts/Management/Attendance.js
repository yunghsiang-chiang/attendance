$(document).ready(async function () {
    let attendanceChart; // 定義圖表變數
    let currentDate = new Date(); // 取得當前日期
    let allLeaveRecords = [];      // ✅ 新增：儲存當月所有請假資料
    let currentFilterUserId = null; // ✅ 新增：目前篩選中的員工ID（再點同人即取消）
    // 更新顯示的月份資訊
    function updateMonthLabel() {
        const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        const year = currentDate.getFullYear(); // 取得年份
        const month = currentDate.getMonth(); // 取得月份 (月份從0開始)
        $("#currentMonthLabel").text(`${year}年 ${monthNames[month]}`); // 更新顯示的月份標籤
        // 調用函數來獲取並展示請假記錄
        fetchLeaveRecords(year, month + 1);
    }
    // 上一月按鈕
    $("#prevMonthBtn").on("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1); // 設置當前月份為上個月
        updateMonthLabel(); // 更新顯示的月份標籤
        showchart(); // 更新圖表
    });
    // 下一月按鈕
    $("#nextMonthBtn").on("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1); // 設置當前月份為下個月
        updateMonthLabel(); // 更新顯示的月份標籤
        showchart(); // 更新圖表
    });

    // 使用 Promise 封裝 API 請求來獲取出勤數據
    async function fetchAttendanceData(userid, year, month) {
        const apiUrl = `https://internal.hochi.org.tw:8082/api/attendance/get_attendanceDates?userid=${userid}&attendanceyear=${year}&attendancemonth=${month}`;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl, // 請求 API 的 URL
                type: 'GET', // HTTP 方法
                success: function (response) {
                    resolve(response.map(item => {
                        const date = new Date(item.attendanceDates); // 將出勤日期轉為日期格式
                        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; // 格式化日期
                    }));
                },
                error: function (error) {
                    console.error(`Error fetching attendance data for ${userid}:`, error); // 錯誤處理
                    reject(error);
                }
            });
        });
    }

    // 獲取請假數據
    async function fetchLeaveData(year, month) {
        const apiUrl = `https://internal.hochi.org.tw:8082/api/attendance/get_leave_record_by_year_month?year=${year}&month=${month}`;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl, // 請求 API 的 URL
                type: 'GET', // HTTP 方法
                success: function (response) {
                    resolve(response); // 返回請假數據
                },
                error: function (error) {
                    console.error('Error fetching leave data:', error); // 錯誤處理
                    reject(error);
                }
            });
        });
    }

    // 獲取加班數據
    async function fetchOvertimeData(year, month) {
        const apiUrl = `https://internal.hochi.org.tw:8082/api/attendance/get_overtime_record_by_year_month?year=${year}&month=${month}`;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl, // 請求 API 的 URL
                type: 'GET', // HTTP 方法
                success: function (response) {
                    resolve(response); // 返回加班數據
                },
                error: function (error) {
                    console.error('Error fetching overtime data:', error); // 錯誤處理
                    reject(error);
                }
            });
        });
    }

    // 獲取員工數據並動態生成員工出勤數據
    async function showchart() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const workingDays = [];
        const api_url = `https://internal.hochi.org.tw:8082/api/attendance/get_attendanceDays?calendaryear=${year}&calendarmonth=${month}`;
        const daysData = await $.getJSON(api_url);

        if (daysData.length > 0) {
            let attendance_days = daysData[0].attendance_days.split(',');
            workingDays.push(...attendance_days);
        }

        // 獲取所有員工的ID和姓名
        const personData = await $.getJSON('https://internal.hochi.org.tw:8082/api/hochi_learners/get_person_IdNameType');

        // 過濾掉 person_type 為 'group' 的資料
        const filteredPersonData = personData.filter(person => person.person_type !== 'group');

        const employeeNames = filteredPersonData.map(person => person.person_name);
        const employeeIds = filteredPersonData.map(person => person.person_id);

        const employeeAttendance = [];

        // 獲取每位員工的出勤數據
        for (let i = 0; i < employeeIds.length; i++) {
            const employeeData = await fetchAttendanceData(employeeIds[i], year, month);
            employeeAttendance.push(workingDays.map(day => employeeData.includes(day) ? 1 : 0));
        }

        const leaveData = await fetchLeaveData(year, month);
        const overtimeData = await fetchOvertimeData(year, month);
        allLeaveRecords = leaveData;  // ✅ 新增：同步到全域暫存
        currentFilterUserId = null;   // ✅ 新增：換月時清掉既有篩選

        $("#attendanceTable tbody").empty();

        employeeAttendance.forEach((attendanceData, index) => {
            const actualAttendance = attendanceData.reduce((sum, value) => sum + value, 0);
            const userId = employeeIds[index];

            // 分類請假數據
            const userLeaveRecords = leaveData.filter(record => record.userId === userId);

            const sickLeaveCount = userLeaveRecords
                .filter(record => record.leaveType === '病假')
                .reduce((sum, record) => sum + (record.count_hours / 8), 0);

            const personalLeaveCount = userLeaveRecords
                .filter(record => record.leaveType === '事假')
                .reduce((sum, record) => sum + (record.count_hours / 8), 0);

            const menstrualLeaveCount = userLeaveRecords
                .filter(record => record.leaveType === '生理假')
                .reduce((sum, record) => sum + (record.count_hours / 8), 0);

            const otherLeaveCount = userLeaveRecords
                .filter(record => !['病假', '事假', '生理假'].includes(record.leaveType))
                .reduce((sum, record) => sum + (record.count_hours / 8), 0);

            const overtimeCount = overtimeData
                .filter(record => record.userID === userId)
                .reduce((sum, record) => sum + (record.count_hours / 8), 0);

            // Helper function to replace "0.00" with an empty string
            const displayValue = value => value === 0 ? '' : value.toFixed(2);

            const row = `
<tr data-user-id="${userId}" data-user-name="${employeeNames[index]}">
    <td>${employeeNames[index]}</td>
    <td>${workingDays.length}</td>
    <td>${displayValue(actualAttendance)}</td>
    <td>${displayValue(overtimeCount)}</td>
    <td>${displayValue(sickLeaveCount + personalLeaveCount + menstrualLeaveCount + otherLeaveCount)}</td>
    <td>${displayValue(sickLeaveCount)}</td>
    <td>${displayValue(personalLeaveCount)}</td>
    <td>${displayValue(menstrualLeaveCount)}</td>
    <td>${displayValue(otherLeaveCount)}</td>
</tr>
`;
            $('#attendanceTable tbody').append(row);
        });

        // 清空舊的圖表
        if (attendanceChart) {
            attendanceChart.destroy(); // 銷毀舊的圖表
        }

        // 繪製圖表
        const ctx = document.getElementById('attendanceChart').getContext('2d');

        // 獲取當前日期
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // 格式化當前日期為 YYYY-MM-DD

        // 生成應到人數，考量當前日期
        const attendanceData = workingDays.map(day => {
            const dayDate = new Date(day); // 將 workingDays 的每個日期字串轉為 Date 物件
            return dayDate <= today ? employeeIds.length : 0; // 如果日期早於或等於今天，應到人數為員工總數，否則為 0
        });

        // 繪製圖表
        attendanceChart = new Chart(ctx, {
            type: 'bar', // 直條圖
            data: {
                labels: workingDays, // X 軸標籤 (工作日)
                datasets: [
                    {
                        type: 'line', // 折線圖
                        label: '應到人數',
                        data: attendanceData, // 應到人數數據
                        borderColor: 'blue', // 線條顏色
                        fill: false,
                        tension: 0.1 // 線條張力
                    },
                    ...filteredPersonData.map((person, index) => ({
                        label: `${person.person_name}報到`,
                        data: employeeAttendance[index], // 員工的報到數據
                        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`, // 隨機顏色
                        stack: 'Stack 0' // 堆疊
                    }))
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true // X軸堆疊
                    },
                    y: {
                        stacked: true, // Y軸堆疊
                        beginAtZero: true // 從 0 開始
                    }
                }
            }
        });

        // ❺ 在 showchart() 末尾（建立完表格、也建完圖表）綁定點擊事件代理
        //   放在 showchart() 的最後面即可（避免重複綁定先 off 再 on）
        $('#attendanceTable tbody').off('click').on('click', 'tr', function () {
            const uid = $(this).data('userId');
            const uname = $(this).data('userName');

            if (!uid) return;

            // 點到同一位員工 -> 取消篩選，還原全部
            if (currentFilterUserId === uid) {
                currentFilterUserId = null;
                displayLeaveRecords(allLeaveRecords);
                return;
            }

            // 設定新篩選並顯示
            currentFilterUserId = uid;
            const filtered = (allLeaveRecords || []).filter(r => r.userId === uid);
            displayLeaveRecords(filtered);

            // 可選：視覺提示目前鎖定列（簡單加上 active 樣式）
            $(this).addClass('table-active').siblings().removeClass('table-active');
        });

    }

    // 獲取並展示請假記錄
    async function fetchLeaveRecords(year, month) {
        const url = `https://internal.hochi.org.tw:8082/api/attendance/get_leave_record_by_year_month?year=${year}&month=${month}`;
        try {
            const response = await fetch(url); // 發起 API 請求
            if (!response.ok) {
                throw new Error('Network response was not ok'); // 如果請求失敗則拋出錯誤
            }
            const leaveRecords = await response.json(); // 將響應轉為 JSON 格式
            allLeaveRecords = leaveRecords; // ✅ 新增：更新全域暫存

            // 若已有鎖定某位員工，沿用篩選；否則顯示全部
            if (currentFilterUserId) {
                const filtered = leaveRecords.filter(r => r.userId === currentFilterUserId);
                displayLeaveRecords(filtered); // 展示請假記錄
            } else {
                displayLeaveRecords(leaveRecords); // 展示請假記錄
            }
        } catch (error) {
            console.error('Fetch error:', error); // 錯誤處理
        }
    }

    // 顯示請假記錄
    function displayLeaveRecords(records) {
        const leaveRecordsContainer = document.getElementById('leave_records');
        leaveRecordsContainer.innerHTML = ''; // 清空之前的請假記錄

        if (!records || records.length === 0) {
            const li = document.createElement('li');
            li.textContent = currentFilterUserId ? '（該員工本月無請假紀錄）' : '（本月無請假紀錄）';
            leaveRecordsContainer.appendChild(li);
            return;
        }

        records.forEach(record => {
            const li = document.createElement('li'); // 創建列表項
            li.textContent = `${record.userName} - ${record.leaveType} (從 ${new Date(record.startTime).toLocaleString()} 到 ${new Date(record.endTime).toLocaleString()} - ${record.count_hours} 小時)`; // 顯示請假詳細資訊
            leaveRecordsContainer.appendChild(li); // 將列表項添加到容器
        });
    }

    // 初始化頁面
    updateMonthLabel(); // 初始化顯示月份標籤
    await showchart(); // 繪製初始圖表

});
