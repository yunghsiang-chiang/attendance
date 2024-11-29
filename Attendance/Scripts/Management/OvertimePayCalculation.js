$(document).ready(function () {
    const API_PERSON_LIST = "http://internal.hochi.org.tw:8082/api/hochi_learners/get_person_IdName";
    const API_ATTENDANCE_DAYS = "http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDays";
    const API_OVERTIME_RECORDS = "http://internal.hochi.org.tw:8082/api/attendance/get_overtime_record";

    // 加載用戶資料到下拉選單
    async function loadUserSelect() {
        try {
            const response = await fetch(API_PERSON_LIST);
            const personData = await response.json();
            const userSelect = $("#userSelect");
            personData.forEach(person => {
                const option = `<option value="${person.person_id}">${person.person_name}</option>`;
                userSelect.append(option);
            });
        } catch (error) {
            console.error("加載用戶資料失敗:", error);
        }
    }

    // 取得月最後日期
    function getLastDayOfMonth(year, month) {
        return new Date(year, month, 0).getDate(); // month 不需要 -1，因為設定 0 已經會返回上月的最後一天
    }

    // 計算按鈕點擊事件
    $("#calculateButton").on("click", async function () {
        const userId = $("#userSelect").val();
        const year = $("#year").val();
        const month = $("#month").val();

        if (!userId || !year || !month) {
            alert("請完整選擇用戶、年份和月份！");
            return;
        }

        try {
            // 動態計算該月的最後一天
            const lastDay = getLastDayOfMonth(year, month);

            const startDate = `${year}-${month.padStart(2, "0")}-01`;
            const endDate = `${year}-${month.padStart(2, "0")}-${lastDay}`;

            // 獲取上班日資料
            const attendanceDaysResponse = await fetch(`${API_ATTENDANCE_DAYS}?calendaryear=${year}&calendarmonth=${month}`);
            const attendanceDaysData = await attendanceDaysResponse.json();
            const workDays = attendanceDaysData[0]?.attendance_days?.split(",") || [];

            // 獲取加班記錄
            const overtimeResponse = await fetch(`${API_OVERTIME_RECORDS}?userid=${userId}&startdate=${startDate}&enddate=${endDate}`);
            const overtimeRecords = await overtimeResponse.json();

            if (!Array.isArray(overtimeRecords)) {
                throw new Error("加班記錄格式錯誤，請檢查 API 回傳資料。");
            }

            // 計算加班費
            const overtimeSummary = calculateOvertime(workDays, overtimeRecords);

            // 更新結果表
            updateResultsTable(overtimeSummary);

            // 更新加班明細
            updateDetailsTable(overtimeRecords);
        } catch (error) {
            console.error("加班費計算錯誤:", error);
            alert("無法加載資料，請稍後再試！");
        }
    });

    // 加班費計算邏輯
    function calculateOvertime(workDays, overtimeRecords) {
        const overtimeSummary = {
            "1.34": 0,
            "1.67": 0,
            "2.67": 0,
        };

        overtimeRecords.forEach(record => {
            const isWorkDay = workDays.includes(record.startTime.split("T")[0]);
            let remainingHours = record.count_hours;

            if (isWorkDay) {
                // 平日加班
                if (remainingHours > 2) {
                    overtimeSummary["1.34"] += 2;
                    remainingHours -= 2;
                } else {
                    overtimeSummary["1.34"] += remainingHours;
                    remainingHours = 0;
                }

                if (remainingHours > 0) {
                    overtimeSummary["1.67"] += remainingHours;
                }
            } else {
                // 休息日加班
                if (remainingHours > 2) {
                    overtimeSummary["1.34"] += 2;
                    remainingHours -= 2;
                } else {
                    overtimeSummary["1.34"] += remainingHours;
                    remainingHours = 0;
                }

                if (remainingHours > 6) {
                    overtimeSummary["1.34"] += 6;
                    remainingHours -= 6;
                } else {
                    overtimeSummary["1.34"] += remainingHours;
                    remainingHours = 0;
                }

                if (remainingHours > 0) {
                    overtimeSummary["2.67"] += remainingHours;
                }
            }
        });

        return overtimeSummary;
    }

    // 更新結果表
    function updateResultsTable(overtimeSummary) {
        const resultsTable = $("#resultsTable");
        resultsTable.empty();

        for (const [multiplier, hours] of Object.entries(overtimeSummary)) {
            const row = `<tr><td>${multiplier}</td><td>${hours.toFixed(2)}</td></tr>`;
            resultsTable.append(row);
        }
    }

    // 更新加班明細表格
    function updateDetailsTable(overtimeRecords) {
        const detailsTable = $("#detailsTable");
        detailsTable.empty();

        overtimeRecords.forEach(record => {
            const row = `
                <tr>
                    <td>${new Date(record.startTime).toLocaleString()}</td>
                    <td>${new Date(record.endTime).toLocaleString()}</td>
                    <td>${record.count_hours.toFixed(2)}</td>
                    <td>${new Date(record.submitted_at).toLocaleString()}</td>
                    <td>${record.approved_by || "未審批"}</td>
                </tr>
            `;
            detailsTable.append(row);
        });
    }

    // 頁面加載時初始化
    loadUserSelect();
});
