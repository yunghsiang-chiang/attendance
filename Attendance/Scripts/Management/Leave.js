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
        const staffLeaveElement = document.querySelector('.staff_leave');
        staffLeaveElement.innerHTML = '<span>員工休假狀態表</span>';

        const table = document.createElement('table');
        table.setAttribute('border', '1');

        // 添加表格標頭
        const headerRow = document.createElement('tr');
        const headers = [
            { title: '員工姓名', key: 'person_name' },
            { title: '起始日期', key: 'start_work' },
            { title: '特休時數', key: 'special_vacation_hours' },
            { title: '事假時數', key: 'personal_leave_hours' },
            { title: '補休時數', key: 'compensatory_leave_hours' }
        ];

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.title;
            th.style.cursor = 'pointer'; // 顯示指標手勢
            th.onclick = () => sortTable(data, header.key); // 點擊排序
            headerRow.appendChild(th);
        });

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
        try {
            // 從 API 取得休假資料
            const response = await fetch('http://internal.hochi.org.tw:8082/api/attendance/get_person_vacation');
            const data = await response.json();

            // 從資料中提取圖表需要的資訊
            const labels = data.map(person => person.person_name); // 員工姓名
            const specialVacationHours = data.map(person => person.special_vacation_hours); // 特休時數
            const personalLeaveHours = data.map(person => person.personal_leave_hours); // 事假時數
            const compensatoryLeaveHours = data.map(person => person.compensatory_leave_hours); // 補休時數

            // 建立圖表
            const ctx = document.getElementById('attendanceChart').getContext('2d');
            const attendanceChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels, // 動態設置員工姓名
                    datasets: [
                        {
                            label: '特休時數',
                            data: specialVacationHours, // 從 API 取得的特休時數
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                        {
                            label: '事假時數',
                            data: personalLeaveHours, // 從 API 取得的事假時數
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        },
                        {
                            label: '補休時數',
                            data: compensatoryLeaveHours, // 從 API 取得的補休時數
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            stacked: true, // X 軸堆疊顯示
                        },
                        y: {
                            stacked: true, // Y 軸堆疊顯示
                        }
                    }
                }
            });
        } catch (error) {
            console.error('取得或處理資料時發生錯誤:', error); // 錯誤處理
        }
    }

    // 定義排序函式
    function sortTable(data, key) {
        const table = document.querySelector('table');
        const isAscending = table.getAttribute('data-sort-order') === 'asc';

        // 根據指定的 key 排序資料
        const sortedData = data.sort((a, b) => {
            if (key === 'start_work') {
                return isAscending ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
            } else {
                return isAscending ? a[key] - b[key] : b[key] - a[key];
            }
        });

        // 清空表格並重新填充資料
        table.innerHTML = '';
        populateAttendanceTable(sortedData);

        // 切換排序順序
        table.setAttribute('data-sort-order', isAscending ? 'desc' : 'asc');
    }


    // 呼叫 fetchAttendanceData 函式以載入資料
    await fetchAttendanceData();
    await leavechart();
})