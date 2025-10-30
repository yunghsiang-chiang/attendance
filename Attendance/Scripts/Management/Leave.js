$(document).ready(async function () {

    // 定義全域變數（保留你原有行為）
    let currentTooltipContent = "";

    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.key.toLowerCase() === 's') {
            if (currentTooltipContent) {
                copyToClipboardFallback(currentTooltipContent);
                alert("內容已複製到剪貼板！");
            } else {
                alert("目前沒有可複製的內容！");
            }
        }
    });

    // ===== 小工具：統一兩位小數顯示 =====
    const fmt2 = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n.toFixed(2) : '0.00';
    };
    // 換算年資（年），使用 365.2425 天/年
    const yearsBetween = (start, end) => {
        const ms = new Date(end) - new Date(start);
        const yearMs = 365.2425 * 24 * 60 * 60 * 1000;
        return ms / yearMs;
    };

    // 取出勤資料
    async function fetchAttendanceData() {
        const apiUrl = 'http://internal.hochi.org.tw:8082/api/attendance/get_person_vacation';
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP 錯誤！狀態: ${response.status}`);
            const data = await response.json();

            if (!data.$values || !Array.isArray(data.$values)) {
                throw new Error('出勤資料格式不正確');
            }
            const extractedData = data.$values;

            // 更新剩餘假別（依近一年請假扣除）與計算年資
            const updatedData = await updateLeaveHours(extractedData);

            // 繪表格
            populateAttendanceTable(updatedData);
            return updatedData;
        } catch (error) {
            console.error('獲取出勤資料時出錯:', error);
            return [];
        }
    }

    // 依「到職週年制」扣除近一年請假記錄；同時計算年資
    async function updateLeaveHours(data) {
        const leaveApiUrl = 'http://internal.hochi.org.tw:8082/api/attendance/get_leave_record_last_year';
        try {
            const leaveResponse = await fetch(leaveApiUrl);
            if (!leaveResponse.ok) throw new Error(`HTTP 錯誤！狀態: ${leaveResponse.status}`);
            const leaveData = await leaveResponse.json();
            if (!Array.isArray(leaveData)) throw new Error('請假紀錄資料不是陣列');

            const now = new Date();

            data.forEach(person => {
                let remainSpecial = Number(person.special_vacation_hours) || 0;
                let remainPersonal = Number(person.personal_leave_hours) || 0;

                // 計算今年度到職週年範圍
                const startWorkDate = new Date(person.start_work);
                // 年資（年），顯示兩位小數
                person.years_of_service = Number(fmt2(yearsBetween(startWorkDate, now)));

                const anniversaryThisYear = new Date(startWorkDate);
                anniversaryThisYear.setFullYear(now.getFullYear());
                // 週年起訖（若今天尚未到今年週年日，區間為去年的週年日至今年週年日）
                if (now < anniversaryThisYear) {
                    anniversaryThisYear.setFullYear(now.getFullYear() - 1);
                }
                const nextAnniversary = new Date(anniversaryThisYear);
                nextAnniversary.setFullYear(anniversaryThisYear.getFullYear() + 1);

                // 預備滑鼠提示資料
                person.leaveRecords = {
                    specialVacation: [],
                    personalLeave: []
                };

                // 扣除近一年內的「特休 / 事假」時數；（✅ 不再處理補休）
                leaveData.forEach(leave => {
                    if (leave.userId === person.person_id) {
                        const leaveStart = new Date(leave.startTime);
                        if (leaveStart >= anniversaryThisYear && leaveStart <= nextAnniversary) {
                            const hrs = Number(leave.count_hours) || 0;
                            if (leave.leaveType === '特休') {
                                remainSpecial -= hrs;
                                person.leaveRecords.specialVacation.push(leave);
                            } else if (leave.leaveType === '事假') {
                                remainPersonal -= hrs;
                                person.leaveRecords.personalLeave.push(leave);
                            }
                        }
                    }
                });

                // 只保留剩餘欄位（兩位小數顯示用數值保留原樣，渲染時再 toFixed）
                person.special_vacation_hours = remainSpecial;
                person.personal_leave_hours = remainPersonal;

                // ✅ 明確移除補休欄位（若原物件有）
                delete person.compensatory_leave_hours;
            });

            return data;
        } catch (error) {
            console.error('更新休假時數時出錯:', error);
            // 仍計算年資、並刪除補休欄位
            const now = new Date();
            data.forEach(person => {
                person.years_of_service = Number(fmt2(yearsBetween(new Date(person.start_work), now)));
                delete person.compensatory_leave_hours;
            });
            return data;
        }
    }

    // 產出員工休假狀態表
    function populateAttendanceTable(data) {
        const staffLeaveElement = document.querySelector('.staff_leave');
        staffLeaveElement.innerHTML = '<span>員工休假狀態表</span>';

        const table = document.createElement('table');
        table.setAttribute('border', '1');

        const headerRow = document.createElement('tr');
        const headers = [
            { title: '員工姓名', key: 'person_name' },
            { title: '起始日期', key: 'start_work' },
            { title: '剩餘特休時數', key: 'special_vacation_hours' }, // ✅ 改名
            { title: '剩餘事假時數', key: 'personal_leave_hours' },  // ✅ 改名
            { title: '年資(年)', key: 'years_of_service' }           // ✅ 以年資取代補休欄位
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
                <td class="vacation-cell special-vacation" data-id="${person.person_id}">${fmt2(person.special_vacation_hours)}</td>
                <td class="vacation-cell personal-leave" data-id="${person.person_id}">${fmt2(person.personal_leave_hours)}</td>
                <td>${fmt2(person.years_of_service)}</td>
            `;
            table.appendChild(row);
        });

        staffLeaveElement.appendChild(table);

        // 滑鼠提示（仍保留特休/事假）
        addHoverEffect(data);
    }

    // 滑鼠提示（Alt+S 可複製）
    function addHoverEffect(data) {
        document.querySelectorAll('.special-vacation').forEach(cell => {
            cell.addEventListener('mouseover', function () {
                const userId = this.getAttribute('data-id');
                const person = data.find(p => p.person_id === userId);
                if (person) showLeaveTooltip(this, person.leaveRecords.specialVacation, '特休');
            });
            cell.addEventListener('mouseout', hideLeaveTooltip);
        });

        document.querySelectorAll('.personal-leave').forEach(cell => {
            cell.addEventListener('mouseover', function () {
                const userId = this.getAttribute('data-id');
                const person = data.find(p => p.person_id === userId);
                if (person) showLeaveTooltip(this, person.leaveRecords.personalLeave, '事假');
            });
            cell.addEventListener('mouseout', hideLeaveTooltip);
        });
    }

    function showLeaveTooltip(element, records, leaveType) {
        let content = `<strong>${leaveType}紀錄:</strong><ul>`;
        records.forEach(record => {
            const start = new Date(record.startTime);
            const end = new Date(record.endTime);
            const hrs = Number(record.count_hours) || 0;

            // 超過 8 小時 → 顯示起訖日期；否則只顯示起始日期
            const datePart = hrs > 8
                ? `${start.toLocaleDateString()} → ${end.toLocaleDateString()}`
                : `${start.toLocaleDateString()}`;

            content += `<li>${datePart} - ${hrs.toFixed(2)} 小時</li>`;
        });
        content += '</ul>';
        // 讓 Alt+S 可複製的純文字也包含新格式
        currentTooltipContent = content.replace(/<[^>]+>/g, '');

        let tooltip = document.createElement('div');
        tooltip.classList.add('leave-tooltip');
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#fff';
        tooltip.style.border = '1px solid #ccc';
        tooltip.style.padding = '10px';
        tooltip.style.zIndex = '1000';
        tooltip.innerHTML = content;

        document.body.appendChild(tooltip);
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY}px`;
    }

    function hideLeaveTooltip() {
        const tooltip = document.querySelector('.leave-tooltip');
        if (tooltip) tooltip.remove();
        currentTooltipContent = "";
    }

    function copyToClipboardFallback(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // 依欄位排序（start_work 用日期，其餘數值）
    function sortTable(data, key) {
        const table = document.querySelector('table');
        const isAscending = table.getAttribute('data-sort-order') === 'asc';

        const sortedData = data.sort((a, b) => {
            if (key === 'start_work') {
                return isAscending ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
            } else {
                const av = Number(a[key]) || 0;
                const bv = Number(b[key]) || 0;
                return isAscending ? av - bv : bv - av;
            }
        });

        table.innerHTML = '';
        populateAttendanceTable(sortedData);
        table.setAttribute('data-sort-order', isAscending ? 'desc' : 'asc');
    }

    // 先載入 & 更新資料
    const updatedData = await fetchAttendanceData();

    // ===== 圖表（已移除「補休」資料集）=====
    async function leavechart() {
        const labels = updatedData.map(person => person.person_name);
        const specialVacationHours = updatedData.map(person => Number(fmt2(person.special_vacation_hours)));
        const personalLeaveHours = updatedData.map(person => Number(fmt2(person.personal_leave_hours)));

        const ctx = document.getElementById('attendanceChart').getContext('2d');
        const attendanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '剩餘特休時數', // ✅ 改名
                        data: specialVacationHours
                    },
                    {
                        label: '剩餘事假時數', // ✅ 改名
                        data: personalLeaveHours
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: { stacked: true },
                    y: { stacked: true }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${fmt2(ctx.parsed.y)} 小時`
                        }
                    }
                }
            }
        });
    }

    await leavechart();
});
