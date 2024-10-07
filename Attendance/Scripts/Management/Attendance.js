$(document).ready(async function () {
    let attendanceChart; // 定義圖表變數
    let currentDate = new Date(); // 取得當前日期
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
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDates?userid=${userid}&attendanceyear=${year}&attendancemonth=${month}`;
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
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_leave_record_by_year_month?year=${year}&month=${month}`;
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
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_overtime_record_by_year_month?year=${year}&month=${month}`;
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

    // 繪製圖表並填充表格
    async function showchart() {
        const year = currentDate.getFullYear(); // 取得年份
        const month = currentDate.getMonth() + 1; // 取得月份 (加1使其對應實際月份)
        const workingDays = []; // 定義一個存放工作日的陣列
        const api_url = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDays?calendaryear=${year}&calendarmonth=${month}`;
        const daysData = await $.getJSON(api_url); // 請求出勤日數據
        if (daysData.length > 0) {
            let attendance_days = daysData[0].attendance_days.split(','); // 取得出勤日
            workingDays.push(...attendance_days); // 存入工作日陣列
        }

        // 獲取員工出勤數據
        const employeeA = await fetchAttendanceData('1206307', year, month); // 員工A數據
        const employeeB = await fetchAttendanceData('chungchen.yang', year, month); // 員工B數據
        const employeeC = await fetchAttendanceData('yuwei.chang', year, month); // 員工C數據
        const employeeD = await fetchAttendanceData('xiaosam001', year, month); // 員工D數據

        // 獲取請假和加班數據
        const leaveData = await fetchLeaveData(year, month); // 請假數據
        const overtimeData = await fetchOvertimeData(year, month); // 加班數據

        // 計算各員工的出勤數據
        const employeeAttendance = [employeeA, employeeB, employeeC, employeeD].map(employeeDates => {
            return workingDays.map(day => employeeDates.includes(day) ? 1 : 0); // 逐一對比工作日與實際出勤日
        });

        // 動態生成表格數據
        const employeeNames = ["江永祥", "楊崇真", "張育維", "廖哲儒"]; // 員工姓名
        const employeeIds = ["1206307", "chungchen.yang", "yuwei.chang", "xiaosam001"]; // 員工ID

        $("#attendanceTable tbody").empty(); // 清空表格內容

        employeeAttendance.forEach((attendanceData, index) => {
            const actualAttendance = attendanceData.reduce((sum, value) => sum + value, 0); // 計算實際出勤天數
            const userId = employeeIds[index]; // 員工ID

            // 計算請假與加班數據
            const leaveCount = leaveData
                .filter(record => record.userId === userId)
                .reduce((sum, record) => sum + (record.count_hours / 8), 0); // 請假天數
            const overtimeCount = overtimeData
                .filter(record => record.userID === userId)
                .reduce((sum, record) => sum + (record.count_hours / 8), 0); // 加班天數

            const row = `
                <tr>
                    <td>${employeeNames[index]}</td>
                    <td>${workingDays.length}</td> <!-- 應出勤天數 -->
                    <td>${actualAttendance}</td> <!-- 實際出勤天數 -->
                    <td>${overtimeCount}</td> <!-- 加班天數 -->
                    <td>${leaveCount}</td> <!-- 補修天數 -->
                    <td>0</td> <!-- 病假天數 -->
                    <td>0</td> <!-- 事假天數 -->
                    <td>0</td> <!-- 生理假天數 -->
                    <td>0</td> <!-- 其他天數 -->
                </tr>
            `;
            $('#attendanceTable tbody').append(row); // 動態插入表格行
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
            return day <= todayString ? 4 : 0; // 如果日期早於或等於今天，應到人數為 4，否則為 0
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
                    {
                        label: '江永祥報到',
                        data: employeeAttendance[0], // 員工A的報到數據
                        backgroundColor: 'rgba(75, 192, 192, 0.6)', // 顏色
                        stack: 'Stack 0' // 堆疊
                    },
                    {
                        label: '楊崇真報到',
                        data: employeeAttendance[1], // 員工B的報到數據
                        backgroundColor: 'rgba(255, 99, 132, 0.6)', // 顏色
                        stack: 'Stack 0'
                    },
                    {
                        label: '張育維報到',
                        data: employeeAttendance[2], // 員工C的報到數據
                        backgroundColor: 'rgba(54, 162, 235, 0.6)', // 顏色
                        stack: 'Stack 0'
                    },
                    {
                        label: '廖哲儒報到',
                        data: employeeAttendance[3], // 員工D的報到數據
                        backgroundColor: 'rgba(184, 134, 11, 0.6)', // 顏色
                        stack: 'Stack 0'
                    }
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

    }

    // 獲取並展示請假記錄
    async function fetchLeaveRecords(year, month) {
        const url = `http://internal.hochi.org.tw:8082/api/attendance/get_leave_record_by_year_month?year=${year}&month=${month}`;
        try {
            const response = await fetch(url); // 發起 API 請求
            if (!response.ok) {
                throw new Error('Network response was not ok'); // 如果請求失敗則拋出錯誤
            }
            const leaveRecords = await response.json(); // 將響應轉為 JSON 格式
            displayLeaveRecords(leaveRecords); // 展示請假記錄
        } catch (error) {
            console.error('Fetch error:', error); // 錯誤處理
        }
    }

    // 顯示請假記錄
    function displayLeaveRecords(records) {
        const leaveRecordsContainer = document.getElementById('leave_records');
        leaveRecordsContainer.innerHTML = ''; // 清空之前的請假記錄

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
