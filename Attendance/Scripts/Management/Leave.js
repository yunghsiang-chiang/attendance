$(document).ready(async function () {

    // ===== 狀態 =====
    let currentTooltipContent = "";
    let currentUnit = 'hours'; // 'hours' | 'days'
    const HOUR_PER_DAY = 8;
    let chartRef = null;       // Chart.js 實例
    let cachedData = [];       // 以「小時」為基準的原始資料（已扣抵＆計算完成）

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

    // ===== 小工具 =====
    const fmt2 = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n.toFixed(2) : '0.00';
    };
    const toUnit = (hours) => {
        if (currentUnit === 'days') return (Number(hours) || 0) / HOUR_PER_DAY;
        return Number(hours) || 0;
    };
    const unitLabel = () => currentUnit === 'days' ? '天數' : '時數';
    const unitSuffix = () => currentUnit === 'days' ? '天' : '小時';
    const yearsBetween = (start, end) => {
        const ms = new Date(end) - new Date(start);
        return ms / (365.2425 * 24 * 60 * 60 * 1000);
    };

    // ===== 取＆加工資料（以「小時」為基準）=====
    async function fetchAttendanceData() {
        const apiUrl = 'http://internal.hochi.org.tw:8082/api/attendance/get_person_vacation';
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP 錯誤！狀態: ${response.status}`);
            const data = await response.json();
            if (!data.$values || !Array.isArray(data.$values)) throw new Error('出勤資料格式不正確');
            const extractedData = data.$values;
            const updatedData = await updateLeaveHours(extractedData); // 回傳已扣抵/計年資後的「小時」資料
            return updatedData;
        } catch (error) {
            console.error('獲取出勤資料時出錯:', error);
            return [];
        }
    }

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
                let remainSick = Number(person.personal_sick_hours) || 0;

                const startWorkDate = new Date(person.start_work);
                person.years_of_service = Number(fmt2(yearsBetween(startWorkDate, now)));

                const anniversaryThisYear = new Date(startWorkDate);
                anniversaryThisYear.setFullYear(now.getFullYear());
                if (now < anniversaryThisYear) anniversaryThisYear.setFullYear(now.getFullYear() - 1);
                const nextAnniversary = new Date(anniversaryThisYear);
                nextAnniversary.setFullYear(anniversaryThisYear.getFullYear() + 1);

                person.leaveRecords = { specialVacation: [], personalLeave: [], sickLeave: [] };

                leaveData.forEach(leave => {
                    if (leave.userId === person.person_id) {
                        const leaveStart = new Date(leave.startTime);
                        if (leaveStart >= anniversaryThisYear && leaveStart <= nextAnniversary) {
                            const hrs = Number(leave.count_hours) || 0;
                            if (leave.leaveType === '特休') { remainSpecial -= hrs; person.leaveRecords.specialVacation.push(leave); }
                            else if (leave.leaveType === '事假') { remainPersonal -= hrs; person.leaveRecords.personalLeave.push(leave); }
                            else if (leave.leaveType === '病假') { remainSick -= hrs; person.leaveRecords.sickLeave.push(leave); }
                        }
                    }
                });

                person.special_vacation_hours = remainSpecial;
                person.personal_leave_hours = remainPersonal;
                person.personal_sick_hours = remainSick;
                delete person.compensatory_leave_hours;
            });

            return data;
        } catch (error) {
            console.error('更新休假時數時出錯:', error);
            const now = new Date();
            data.forEach(person => {
                person.years_of_service = Number(fmt2(yearsBetween(new Date(person.start_work), now)));
                delete person.compensatory_leave_hours;
            });
            return data;
        }
    }

    // ===== UI：插入「小時/天」切換器 =====
    function injectUnitSwitcher() {
        const staffLeaveElement = document.querySelector('.staff_leave');
        if (!staffLeaveElement) return;

        const wrap = document.createElement('div');
        wrap.style.margin = '8px 0 6px';
        wrap.innerHTML = `
          <div id="unit-switcher" style="display:flex;align-items:center;gap:8px;">
            <span style="font-weight:600;">顯示單位：</span>
            <div class="btn-group btn-group-sm" role="group" aria-label="unit">
              <button type="button" id="btn-hours" class="btn btn-outline-primary active">小時</button>
              <button type="button" id="btn-days" class="btn btn-outline-primary">天</button>
            </div>
          </div>
        `;
        // 插在 staff_leave 區第一個孩子之前
        staffLeaveElement.prepend(wrap);

        // 綁定
        $('#btn-hours').off('click').on('click', () => {
            if (currentUnit !== 'hours') {
                currentUnit = 'hours';
                $('#btn-hours').addClass('active'); $('#btn-days').removeClass('active');
                renderAll();
            }
        });
        $('#btn-days').off('click').on('click', () => {
            if (currentUnit !== 'days') {
                currentUnit = 'days';
                $('#btn-days').addClass('active'); $('#btn-hours').removeClass('active');
                renderAll();
            }
        });
    }

    // ===== 表格產生（依 currentUnit 顯示）=====
    function populateAttendanceTable(data) {
        const staffLeaveElement = document.querySelector('.staff_leave');
        // 清掉舊表（保留切換器）
        const oldTable = staffLeaveElement.querySelector('table');
        if (oldTable) oldTable.remove();

        const table = document.createElement('table');
        table.setAttribute('border', '1');

        const headerRow = document.createElement('tr');

        const svTitle = `剩餘特休${unitLabel()}`;
        const plTitle = `剩餘事假${unitLabel()}`;
        const skTitle = `剩餘病假${unitLabel()}`;

        const headers = [
            { title: '員工姓名', key: 'person_name' },
            { title: '起始日期', key: 'start_work' },
            { title: svTitle, key: 'special_vacation_hours' },
            { title: plTitle, key: 'personal_leave_hours' },
            { title: skTitle, key: 'personal_sick_hours' },
            { title: '年資(年)', key: 'years_of_service' }
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
            const sv = fmt2(toUnit(person.special_vacation_hours));
            const pl = fmt2(toUnit(person.personal_leave_hours));
            const sk = fmt2(toUnit(person.personal_sick_hours));
            row.innerHTML = `
                <td>${person.person_name}</td>
                <td>${new Date(person.start_work).toLocaleDateString()}</td>
                <td class="vacation-cell special-vacation" data-id="${person.person_id}">${sv}</td>
                <td class="vacation-cell personal-leave"   data-id="${person.person_id}">${pl}</td>
                <td class="vacation-cell sick-leave"       data-id="${person.person_id}">${sk}</td>
                <td>${fmt2(person.years_of_service)}</td>
            `;
            table.appendChild(row);
        });

        staffLeaveElement.appendChild(table);
        addHoverEffect(data); // tooltip 邏輯不變（仍使用請假明細的「小時」）
    }

    // ===== 滑鼠提示（>8 小時顯示起訖日期；≤8 小時顯示起始日期）=====
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
        document.querySelectorAll('.sick-leave').forEach(cell => {
            cell.addEventListener('mouseover', function () {
                const userId = this.getAttribute('data-id');
                const person = data.find(p => p.person_id === userId);
                if (person) showLeaveTooltip(this, person.leaveRecords.sickLeave, '病假');
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
            const datePart = hrs > 8
                ? `${start.toLocaleDateString()} → ${end.toLocaleDateString()}`
                : `${start.toLocaleDateString()}`;
            content += `<li>${datePart} - ${hrs.toFixed(2)} 小時</li>`;
        });
        content += '</ul>';
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

    // ===== 排序：依當前顯示單位換算 =====
    function sortTable(data, key) {
        const table = document.querySelector('table');
        const isAscending = table.getAttribute('data-sort-order') === 'asc';
        const numberKeys = new Set(['special_vacation_hours', 'personal_leave_hours', 'personal_sick_hours', 'years_of_service']);

        const sortedData = data.sort((a, b) => {
            if (key === 'start_work') {
                return isAscending ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
            } else if (numberKeys.has(key)) {
                // 換算為目前單位後比較
                const av = key === 'years_of_service' ? Number(a[key]) || 0 : toUnit(a[key]);
                const bv = key === 'years_of_service' ? Number(b[key]) || 0 : toUnit(b[key]);
                return isAscending ? av - bv : bv - av;
            } else {
                // 文字
                return isAscending ? ('' + a[key]).localeCompare(b[key]) : ('' + b[key]).localeCompare(a[key]);
            }
        });

        table.innerHTML = '';
        populateAttendanceTable(sortedData);
        table.setAttribute('data-sort-order', isAscending ? 'desc' : 'asc');
    }

    // ===== 圖表（依 currentUnit 顯示）=====
    function renderChart(data) {
        const labels = data.map(p => p.person_name);
        const special = data.map(p => Number(fmt2(toUnit(p.special_vacation_hours))));
        const personal = data.map(p => Number(fmt2(toUnit(p.personal_leave_hours))));
        const sick = data.map(p => Number(fmt2(toUnit(p.personal_sick_hours))));

        const ctx = document.getElementById('attendanceChart').getContext('2d');
        if (chartRef) { chartRef.destroy(); }

        const svLabel = `剩餘特休${unitLabel()}`;
        const plLabel = `剩餘事假${unitLabel()}`;
        const skLabel = `剩餘病假${unitLabel()}`;

        chartRef = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: svLabel, data: special },
                    { label: plLabel, data: personal },
                    { label: skLabel, data: sick }
                ]
            },
            options: {
                responsive: true,
                scales: { x: { stacked: true }, y: { stacked: true } },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${fmt2(ctx.parsed.y)} ${unitSuffix()}`
                        }
                    }
                }
            }
        });
    }

    // ===== 重新渲染（切換單位時呼叫）=====
    function renderAll() {
        populateAttendanceTable(cachedData);
        renderChart(cachedData);
    }

    // ===== 初始化 =====
    cachedData = await fetchAttendanceData(); // 以「小時」為基準
    // 插入切換器，再畫表＆圖
    injectUnitSwitcher();
    renderAll();
});
