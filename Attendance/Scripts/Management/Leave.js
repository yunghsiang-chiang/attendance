$(document).ready(async function () {


    // 定義函式以從 Web API 獲取資料
    async function fetchAttendanceData() {
        const apiUrl = 'http://internal.hochi.org.tw:8082/api/attendance/get_person_vacation';

        try {
            // 從 API 獲取資料
            const response = await fetch(apiUrl);

            // 檢查回應是否正常
            if (!response.ok) {
                throw new Error(`HTTP 錯誤！狀態: ${response.status}`);
            }

            // 將回應資料轉換為 JSON 格式
            const data = await response.json();

            // 呼叫函式以將獲取的資料更新到 HTML
            populateAttendanceTable(data);

        } catch (error) {
            console.error('獲取出勤資料時出錯:', error);
        }
    }

    // 定義函式以填充 "員工休假狀態表" 區域
    function populateAttendanceTable(data) {
        // 取得將插入資料的 staff_leave div
        const staffLeaveElement = document.querySelector('.staff_leave');

        // 清除當前內容
        staffLeaveElement.innerHTML = '<span>員工休假狀態表</span>';

        // 建立表格元素以顯示資料
        const table = document.createElement('table');
        table.setAttribute('border', '1');

        // 添加表格標頭
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
        <th>員工姓名</th>
        <th>起始日期</th>
        <th>特休時數</th>
        <th>事假時數</th>
        <th>補休時數</th>
    `;
        table.appendChild(headerRow);

        // 遍歷資料並填充表格行
        data.forEach(person => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${person.person_name}</td>
            <td>${new Date(person.start_work).toLocaleDateString()}</td>
            <td>${person.special_vacation_hours}</td>
            <td>${person.personal_leave_hours}</td>
            <td>${person.compensatory_leave_hours}</td>
        `;
            table.appendChild(row);
        });

        // 將表格添加到 staff_leave div
        staffLeaveElement.appendChild(table);
    }
    // 休假圖表
    async function leavechart() {
        const ctx = document.getElementById('attendanceChart').getContext('2d');
        const attendanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['江永祥', '廖哲儒', '張育維'], // 員工姓名
                datasets: [
                    {
                        label: '特休時數',
                        data: [24, 0, 120], // 特休時數數據
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                    {
                        label: '事假時數',
                        data: [112, 112, 112], // 事假時數數據
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    },
                    {
                        label: '補休時數',
                        data: [0, 0, 0], // 補休時數數據
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                    }
                }
            }
        });
    }

    // 呼叫 fetchAttendanceData 函式以載入資料
    await fetchAttendanceData();
    await leavechart();
})