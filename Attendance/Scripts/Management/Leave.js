$(document).ready(async function () {

    // 定义全局变量存储当前工具提示的内容
    let currentTooltipContent = "";

    // 添加鍵盤事件監聽
    document.addEventListener('keydown', (event) => {
        console.log("Keydown event detected:", event.key, "Alt pressed:", event.altKey); // 調試輸出
        if (event.altKey && event.key.toLowerCase() === 's') {
            if (currentTooltipContent) {
                copyToClipboardFallback(currentTooltipContent);
                alert("內容已複製到剪貼板！");
            } else {
                alert("目前沒有可複製的內容！");
            }
        }
    });

    // 定義函式以從 Web API 獲取出勤資料
    async function fetchAttendanceData() {
        const apiUrl = 'http://internal.hochi.org.tw:8082/api/attendance/get_person_vacation';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP 錯誤！狀態: ${response.status}`);
            }
            const data = await response.json();

            // 確保數據結構正確，提取 $values 屬性中的資料
            if (!data.$values || !Array.isArray(data.$values)) {
                throw new Error('出勤資料格式不正確');
            }

            const extractedData = data.$values;  // 提取 $values 中的數據

            // 在載入數據後，更新休假時數
            const updatedData = await updateLeaveHours(extractedData);

            // 呼叫函式以將更新後的資料更新到 HTML
            populateAttendanceTable(updatedData);
            return updatedData; // 返回更新後的數據
        } catch (error) {
            console.error('獲取出勤資料時出錯:', error);
            return []; // 返回空陣列作為 fallback
        }
    }

    // 定義函式以從新的 Web API 獲取休假紀錄，並更新員工的假期數據
    async function updateLeaveHours(data) {
        const leaveApiUrl = 'http://internal.hochi.org.tw:8082/api/attendance/get_leave_record_last_year';

        try {
            const leaveResponse = await fetch(leaveApiUrl);
            if (!leaveResponse.ok) {
                throw new Error(`HTTP 錯誤！狀態: ${leaveResponse.status}`);
            }
            const leaveData = await leaveResponse.json();

            // 確保請假資料是陣列
            if (!Array.isArray(leaveData)) {
                throw new Error('請假紀錄資料不是陣列');
            }

            // 當前月份，用於檢查補休只扣除當月的紀錄
            const currentDate = new Date();

            // 針對每位員工進行數據更新
            data.forEach(person => {
                let totalSpecialVacation = person.special_vacation_hours;
                let totalPersonalLeave = person.personal_leave_hours;
                let totalCompensatoryLeave = person.compensatory_leave_hours;

                // 計算到職週年日的重置週期
                const startWorkDate = new Date(person.start_work);
                const startWorkAnniversary = new Date(startWorkDate);
                startWorkAnniversary.setFullYear(currentDate.getFullYear());

                // 若當前日期已經過了今年的到職週年日，則將重置時間設定為下一年
                if (currentDate < startWorkAnniversary) {
                    startWorkAnniversary.setFullYear(currentDate.getFullYear() - 1);
                }

                // 計算過去一年的範圍（從到職日週年後計算）
                const nextAnniversary = new Date(startWorkAnniversary);
                nextAnniversary.setFullYear(startWorkAnniversary.getFullYear() + 1);

                // 將該員工的請假紀錄儲存在 person 對象中，用於後續的滑鼠互動顯示
                person.leaveRecords = {
                    specialVacation: [],
                    personalLeave: [],
                };

                // 遍歷每條請假記錄，根據到職週年日週期進行數據扣除
                leaveData.forEach(leave => {
                    if (leave.userId === person.person_id) { // 匹配person_id
                        const leaveStartTime = new Date(leave.startTime);

                        // 確保請假記錄在過去一年內
                        if (leaveStartTime >= startWorkAnniversary && leaveStartTime <= nextAnniversary) {
                            if (leave.leaveType.toLowerCase() === '特休') {
                                totalSpecialVacation -= parseFloat(leave.count_hours);
                                person.leaveRecords.specialVacation.push(leave);
                            }
                            if (leave.leaveType.toLowerCase() === '事假') {
                                totalPersonalLeave -= parseFloat(leave.count_hours);
                                person.leaveRecords.personalLeave.push(leave);
                            }
                            if (leave.leaveType.toLowerCase() === '補休') {
                                totalCompensatoryLeave -= parseFloat(leave.count_hours);
                            }
                        }
                    }
                });

                // 更新數據
                person.special_vacation_hours = totalSpecialVacation;
                person.personal_leave_hours = totalPersonalLeave;
                person.compensatory_leave_hours = totalCompensatoryLeave;
            });

            return data; // 返回更新後的數據
        } catch (error) {
            console.error('更新休假時數時出錯:', error);
            return data; // 若發生錯誤，返回原始數據
        }
    }

    // 定義函式以填充 "員工休假狀態表" 區域
    function populateAttendanceTable(data) {
        const staffLeaveElement = document.querySelector('.staff_leave');
        staffLeaveElement.innerHTML = '<span>員工休假狀態表</span>';

        const table = document.createElement('table');
        table.setAttribute('border', '1');

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
            th.style.cursor = 'pointer';
            th.onclick = () => sortTable(data, header.key);
            headerRow.appendChild(th);
        });

        table.appendChild(headerRow);

        data.forEach(person => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${person.person_name}</td>
                <td>${new Date(person.start_work).toLocaleDateString()}</td>
                <td class="vacation-cell special-vacation" data-id="${person.person_id}">${person.special_vacation_hours}</td>
                <td class="vacation-cell personal-leave" data-id="${person.person_id}">${person.personal_leave_hours}</td>
                <td>${person.compensatory_leave_hours}</td>
            `;
            table.appendChild(row);
        });

        staffLeaveElement.appendChild(table);

        // 為特休和事假單元格添加滑鼠懸停事件
        addHoverEffect(data);
    }

    // 定義函式以添加滑鼠懸停效果
    function addHoverEffect(data) {
        // 處理特休時數的懸停事件
        document.querySelectorAll('.special-vacation').forEach(cell => {
            cell.addEventListener('mouseover', function () {
                const userId = this.getAttribute('data-id');
                const person = data.find(p => p.person_id === userId);
                if (person) {
                    showLeaveTooltip(this, person.leaveRecords.specialVacation, '特休');
                }
            });

            cell.addEventListener('mouseout', function () {
                hideLeaveTooltip();
            });
        });

        // 處理事假時數的懸停事件
        document.querySelectorAll('.personal-leave').forEach(cell => {
            cell.addEventListener('mouseover', function () {
                const userId = this.getAttribute('data-id');
                const person = data.find(p => p.person_id === userId);
                if (person) {
                    showLeaveTooltip(this, person.leaveRecords.personalLeave, '事假');
                }
            });

            cell.addEventListener('mouseout', function () {
                hideLeaveTooltip();
            });
        });
    }

    // 顯示請假紀錄的工具提示
    function showLeaveTooltip(element, records, leaveType) {

        // 构建工具提示内容
        let content = `<strong>${leaveType}紀錄:</strong><ul>`;
        records.forEach(record => {
            content += `<li>${new Date(record.startTime).toLocaleDateString()} - ${record.count_hours} 小時</li>`;
        });
        content += '</ul>';

        // 保存内容到全局变量
        currentTooltipContent = content.replace(/<[^>]+>/g, ''); // 移除 HTML 标签，仅保留纯文本

        // 创建工具提示
        let tooltip = document.createElement('div');
        tooltip.classList.add('leave-tooltip');
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#fff';
        tooltip.style.border = '1px solid #ccc';
        tooltip.style.padding = '10px';
        tooltip.style.zIndex = '1000';
        tooltip.innerHTML = content;

        // 添加到页面
        document.body.appendChild(tooltip);

        // 定位工具提示
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY}px`;
    }

    // 隱藏工具提示
    function hideLeaveTooltip() {
        const tooltip = document.querySelector('.leave-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
        currentTooltipContent = ""; // 清空工具提示内容
    }

    // 替代方案：複製文字到剪貼板
    function copyToClipboardFallback(text) {
        // 創建隱藏的 <textarea>
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);

        // 選中內容並執行複製
        textarea.select();
        document.execCommand('copy');

        // 移除 <textarea>
        document.body.removeChild(textarea);
    }

    // 定義排序函式
    function sortTable(data, key) {
        const table = document.querySelector('table');
        const isAscending = table.getAttribute('data-sort-order') === 'asc';

        const sortedData = data.sort((a, b) => {
            if (key === 'start_work') {
                return isAscending ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
            } else {
                return isAscending ? a[key] - b[key] : b[key] - a[key];
            }
        });

        table.innerHTML = '';
        populateAttendanceTable(sortedData);

        table.setAttribute('data-sort-order', isAscending ? 'desc' : 'asc');
    }

    // 呼叫 fetchAttendanceData 函式以載入和更新資料
    const updatedData = await fetchAttendanceData();

    // 休假圖表
    async function leavechart() {
        const labels = updatedData.map(person => person.person_name);
        const specialVacationHours = updatedData.map(person => person.special_vacation_hours);
        const personalLeaveHours = updatedData.map(person => person.personal_leave_hours);
        const compensatoryLeaveHours = updatedData.map(person => person.compensatory_leave_hours);

        const ctx = document.getElementById('attendanceChart').getContext('2d');
        const attendanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '特休時數',
                        data: specialVacationHours,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                    {
                        label: '事假時數',
                        data: personalLeaveHours,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    },
                    {
                        label: '補休時數',
                        data: compensatoryLeaveHours,
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

    await leavechart();

    
});


