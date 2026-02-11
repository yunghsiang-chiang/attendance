$(document).ready(function () {
    // API 路徑
    const API_PERSON_LIST = "https://internal.hochi.org.tw:8082/api/hochi_learners/get_person_IdName";
    const API_ATTENDANCE_DAYS = "https://internal.hochi.org.tw:8082/api/attendance/get_attendanceDays";
    const API_OVERTIME_RECORDS = "https://internal.hochi.org.tw:8082/api/attendance/get_overtime_record";

    // 加載用戶資料到下拉選單
    async function loadUserSelect() {
        try {
            const response = await fetch(API_PERSON_LIST); // 呼叫 API 取得用戶資料
            const personData = await response.json(); // 解析 API 回應資料
            const userSelect = $("#userSelect"); // 取得下拉選單的 DOM 元素
            personData.forEach(person => {
                // 將每位用戶新增為下拉選單的選項
                const option = `<option value="${person.person_id}">${person.person_name}</option>`;
                userSelect.append(option);
            });
        } catch (error) {
            console.error("加載用戶資料失敗:", error); // 錯誤處理
        }
    }

    // 取得月最後日期
    function getLastDayOfMonth(year, month) {
        // 利用 JavaScript Date 物件取得指定月份的最後一天
        return new Date(year, month, 0).getDate(); // month 不需要 -1，因為設定 0 已經會返回上月的最後一天
    }

    // 計算按鈕點擊事件
    $("#calculateButton").on("click", async function () {
        const userId = $("#userSelect").val(); // 取得選定的用戶 ID
        const year = $("#year").val(); // 取得輸入的年份
        const month = $("#month").val(); // 取得輸入的月份

        // 驗證輸入是否完整
        if (!userId || !year || !month) {
            alert("請完整選擇用戶、年份和月份！");
            return;
        }

        try {
            // 動態計算該月的最後一天
            const lastDay = getLastDayOfMonth(year, month);

            // 組合起始日期與結束日期
            const startDate = `${year}-${month.padStart(2, "0")}-01`; // 月份不足兩位補零
            const endDate = `${year}-${month.padStart(2, "0")}-${lastDay}`;

            // 獲取上班日資料
            const attendanceDaysResponse = await fetch(`${API_ATTENDANCE_DAYS}?calendaryear=${year}&calendarmonth=${month}`);
            const attendanceDaysData = await attendanceDaysResponse.json();
            const workDays = attendanceDaysData[0]?.attendance_days?.split(",") || [];  // 將上班日資料轉為陣列

            // 獲取加班記錄
            const overtimeResponse = await fetch(`${API_OVERTIME_RECORDS}?userid=${userId}&startdate=${startDate}&enddate=${endDate}`);
            const overtimeRecords = await overtimeResponse.json();

            // 確保加班記錄為陣列
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
            console.error("加班費計算錯誤:", error); // 錯誤處理
            alert("無法加載資料，請稍後再試！");
        }
    });

    // 加班費計算邏輯
    function calculateOvertime(workDays, overtimeRecords) {
        // 初始化加班費倍率對應的時數
        const overtimeSummary = {
            "1.34": 0, // 1.34 倍的加班時數
            "1.67": 0, // 1.67 倍的加班時數
            "2.67": 0, // 2.67 倍的加班時數
        };

        // 遍歷加班記錄計算
        overtimeRecords.forEach(record => {
            const isWorkDay = workDays.includes(record.startTime.split("T")[0]); // 檢查是否為上班日
            let remainingHours = record.count_hours; // 初始剩餘加班時數

            if (isWorkDay) {
                // 平日加班
                if (remainingHours > 2) {
                    overtimeSummary["1.34"] += 2; // 前 2 小時為 1.34 倍
                    remainingHours -= 2;
                } else {
                    overtimeSummary["1.34"] += remainingHours; // 不足 2 小時直接歸類為 1.34 倍
                    remainingHours = 0;
                }

                if (remainingHours > 0) {
                    overtimeSummary["1.67"] += remainingHours;; // 超過 2 小時歸類為 1.67 倍
                }
            } else {
                // 休息日加班
                if (remainingHours > 2) {
                    overtimeSummary["1.34"] += 2; // 前 2 小時為 1.34 倍
                    remainingHours -= 2;
                } else {
                    overtimeSummary["1.34"] += remainingHours; // 不足 2 小時直接歸類為 1.34 倍
                    remainingHours = 0;
                }

                if (remainingHours > 6) {
                    overtimeSummary["1.34"] += 6; // 接下來 6 小時為 1.34 倍
                    remainingHours -= 6;
                } else {
                    overtimeSummary["1.34"] += remainingHours; // 不足 6 小時直接歸類為 1.34 倍
                    remainingHours = 0;
                }

                if (remainingHours > 0) {
                    overtimeSummary["2.67"] += remainingHours; // 超過 8 小時歸類為 2.67 倍
                }
            }
        });

        return overtimeSummary; // 返回計算結果
    }

    // 更新結果表
    function updateResultsTable(overtimeSummary) {
        const resultsTable = $("#resultsTable"); // 取得結果表的 DOM 元素
        resultsTable.empty(); // 清空現有內容

        // 填充新的結果資料
        for (const [multiplier, hours] of Object.entries(overtimeSummary)) {
            const row = `<tr><td>${multiplier}</td><td>${hours.toFixed(2)}</td></tr>`;
            resultsTable.append(row);
        }
    }

    // 更新加班明細表格
    function updateDetailsTable(overtimeRecords) {
        const detailsTable = $("#detailsTable"); // 取得加班明細表格的 DOM 元素
        detailsTable.empty(); // 清空現有內容

        // 填充加班記錄資料
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
            detailsTable.append(row); // 新增至表格
        });
    }

    // 頁面加載時初始化
    loadUserSelect(); // 載入用戶清單
});
