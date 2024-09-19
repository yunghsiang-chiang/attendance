$(document).ready(async function () {
    let attendanceChart; // 定義圖表變數
    let currentDate = new Date();

    function updateMonthLabel() {
        const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        $("#currentMonthLabel").text(`${year}年 ${monthNames[month]}`);
    }

    $("#prevMonthBtn").on("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthLabel();
        showchart();
    });

    $("#nextMonthBtn").on("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthLabel();
        showchart();
    });

    // 使用 Promise 封裝 API 請求
    async function fetchAttendanceData(userid, year, month) {
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDates?userid=${userid}&attendanceyear=${year}&attendancemonth=${month}`;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl,
                type: 'GET',
                success: function (response) {
                    resolve(response.map(item => {
                        const date = new Date(item.attendanceDates);
                        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                    }));
                },
                error: function (error) {
                    console.error(`Error fetching attendance data for ${userid}:`, error);
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
                url: apiUrl,
                type: 'GET',
                success: function (response) {
                    resolve(response);
                },
                error: function (error) {
                    console.error('Error fetching leave data:', error);
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
                url: apiUrl,
                type: 'GET',
                success: function (response) {
                    resolve(response);
                },
                error: function (error) {
                    console.error('Error fetching overtime data:', error);
                    reject(error);
                }
            });
        });
    }

    // 繪製圖表並填充表格
    async function showchart() {
        const year = currentDate.getFullYear(); //年份
        const month = currentDate.getMonth() + 1; // 月份從0開始，因此需要加1
        const workingDays = []; // 出勤日 array
        const api_url = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDays?calendaryear=${year}&calendarmonth=${month}`;
        const daysData = await $.getJSON(api_url);
        if (daysData.length > 0) {
            let attendance_days = daysData[0].attendance_days.split(',');
            workingDays.push(...attendance_days);
        }

        // 獲取員工出勤數據
        const employeeA = await fetchAttendanceData('1206307', year, month);
        const employeeB = await fetchAttendanceData('chungchen.yang', year, month);
        const employeeC = await fetchAttendanceData('yuwei.chang', year, month);

        // 獲取請假和加班數據
        const leaveData = await fetchLeaveData(year, month);
        const overtimeData = await fetchOvertimeData(year, month);

        // 計算各員工的出勤數據
        const employeeAttendance = [employeeA, employeeB, employeeC].map(employeeDates => {
            return workingDays.map(day => employeeDates.includes(day) ? 1 : 0);
        });

        // 動態生成表格數據
        const employeeNames = ["江永祥", "楊崇真", "張育維"];
        const employeeIds = ["1206307", "chungchen.yang", "yuwei.chang"];

        $("#attendanceTable tbody").empty(); // 清空表格內容

        employeeAttendance.forEach((attendanceData, index) => {
            const actualAttendance = attendanceData.reduce((sum, value) => sum + value, 0);
            const userId = employeeIds[index];

            // 計算加班與請假數據
            const leaveCount = leaveData
                .filter(record => record.userId === userId)
                .reduce((sum, record) => sum + (record.count_hours / 8), 0); // 將請假時數轉換為天數
            const overtimeCount = overtimeData
                .filter(record => record.userID === userId)
                .reduce((sum, record) => sum + (record.count_hours / 8), 0); // 將加班時數轉換為天數

            const row = `
                <tr>
                    <td>${employeeNames[index]}</td>
                    <td>${workingDays.length}</td> <!-- 應出勤天數 -->
                    <td>${actualAttendance}</td> <!-- 實際上班天數 -->
                    <td>${overtimeCount}</td> <!-- 加班天數 -->
                    <td>${leaveCount}</td> <!-- 補修天數 -->
                    <td>0</td> <!-- 病假天數 -->
                    <td>0</td> <!-- 事假天數 -->
                    <td>0</td> <!-- 生理假天數 -->
                    <td>0</td> <!-- 其他天數 -->
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
        attendanceChart = new Chart(ctx, {
            type: 'bar', // 直條圖
            data: {
                labels: workingDays,
                datasets: [
                    {
                        type: 'line',
                        label: '應到人數',
                        data: workingDays.map(() => 3), // 應到人數固定3
                        borderColor: 'blue',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: '江永祥報到',
                        data: employeeAttendance[0],
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        stack: 'Stack 0'
                    },
                    {
                        label: '楊崇真報到',
                        data: employeeAttendance[1],
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        stack: 'Stack 0'
                    },
                    {
                        label: '張育維報到',
                        data: employeeAttendance[2],
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
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
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // 初始化
    updateMonthLabel();
    await showchart();

});
