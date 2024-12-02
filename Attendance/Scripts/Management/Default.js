$(function () {
    // 開啟公告對話框
    $("#view-all-announcements").click(function () {
        $("#all-announcements-dialog").dialog({
            modal: true,
            width: 400
        });
    });
});

$(document).ready(async function () {
    const API_URL = "http://internal.hochi.org.tw:8082/api/attendance/GetPublishedAnnouncements";
    // 各類型人數初始化
    let staff_qty = 0;
    let disciples_qty = 0;
    let secretary_qty = 0;
    let IT_qty = 0;

    // 儲存各類型的人員詳細資訊
    let staff_details = [];
    let disciples_details = [];
    let secretary_details = [];
    let IT_details = [];
    let attendance_details = [];
    let leave_details = [];
    let no_attendance_details = []; // 未出勤人員清單

    // 獲取 API 資料的 promise 組合
    await Promise.all([
        get_person_types(),
        get_today_attendance_records(),
        get_today_leave_records(),
        updatePendingRequests()
    ]);

    // 計算並顯示未出勤人數
    updateNoAttendanceQty();
    // 初始化公告清單
    loadAnnouncements();

    // 綁定「查看全部」按鈕點擊事件
    $("#view-all-announcements").on("click", function () {
        $("#all-announcements-dialog").dialog({
            modal: true,
            width: 600
        });
    });

    /**
     * 透過 API 獲取公告資料並渲染到公告清單
     */
    async function loadAnnouncements() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("無法載入公告資料");
            }

            const data = await response.json();
            const announcements = data.$values || [];

            // 渲染最新公告（最多顯示 5 則）
            const announcementList = $("#announcement-list");
            announcements.slice(0, 5).forEach(item => {
                const listItem = `
                    <li class="list-group-item">
                        <strong>${item.title}</strong> (${formatDate(item.issue_time)})
                        <button type="button" class="btn btn-link view-content" data-title="${item.title}" data-content='${item.content}'>查看內容</button>
                    </li>`;
                announcementList.append(listItem);
            });

            // 綁定「查看內容」按鈕事件
            $(".view-content").on("click", function () {
                const title = $(this).data("title");
                const content = $(this).data("content");
                showAnnouncementContent(title, content);
            });

            // 渲染所有公告到對話框
            const allAnnouncementsList = $("#all-announcements-list");
            announcements.forEach(item => {
                const listItem = `
                    <li>
                        <strong>${item.title}</strong> (${formatDate(item.issue_time)})<br>
                        <div>${item.content}</div>
                    </li>`;
                allAnnouncementsList.append(listItem);
            });
        } catch (error) {
            console.error("公告載入失敗:", error);
        }
    }

    /**
     * 顯示公告內容於模態框
     * @param {string} title 公告標題
     * @param {string} content 公告內容（HTML 格式）
     */
    function showAnnouncementContent(title, content) {
        // 新增一個 div 包含公告內容
        const modalContent = $(`<div>${content}</div>`);

        // 確保圖片使用正確樣式
        modalContent.find("img").each(function () {
            $(this).addClass("img-responsive");
        });

        // 使用 jQuery UI 的 dialog 顯示內容
        modalContent.dialog({
            title: title,
            modal: true,
            width: "90%", // 動態寬度適配裝置大小
            maxWidth: 600, // 限制最大寬度
            buttons: {
                關閉: function () {
                    $(this).dialog("close");
                }
            }
        });
    }


    /**
     * 格式化日期
     * @param {string} date 日期字串
     * @returns {string} 格式化後的日期
     */
    function formatDate(date) {
        return new Date(date).toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
    }

    /**
     * 取得人員屬性並分類加總
     * 將不同類型的人員分開計數，並更新對應的人數顯示
     */
    async function get_person_types() {
        const api_url = "http://internal.hochi.org.tw:8082/api/hochi_learners/get_person_IdNameType";
        return $.getJSON(api_url, { format: "json" })
            .done(function (data) {
                data.forEach(person => {
                    // 根據人員類型分類並加總
                    switch (person.person_type) {
                        case 'staff':
                            staff_qty++;
                            staff_details.push(person);
                            break;
                        case 'disciple':
                            disciples_qty++;
                            disciples_details.push(person);
                            break;
                        case 'secretary':
                            secretary_qty++;
                            secretary_details.push(person);
                            break;
                        case 'IT':
                            IT_qty++;
                            IT_details.push(person);
                            break;
                    }
                });

                // 更新對應的 HTML 顯示
                updatePersonCount();
            });
    }

    // 更新人數顯示
    function updatePersonCount() {
        $('#staff_qty').text(`${staff_qty}人`);
        $('#disciples_qty').text(`${disciples_qty}人`);
        $('#secretary_qty').text(`${secretary_qty}人`);
        $('#IT_qty').text(`${IT_qty}人`);
    }

    /**
     * 取得今日出勤數據
     * 只記錄出勤或外出公務的人員
     */
    async function get_today_attendance_records() {
        const api_url = "http://internal.hochi.org.tw:8082/api/attendance/get_today_attendance_record/";
        return $.getJSON(api_url, { format: "json" })
            .done(function (data) {
                if (data.length > 0) {
                    const attendance_name_set = new Set();
                    data.forEach(record => {
                        if (!attendance_name_set.has(record.user_name) &&
                            ['到班', '外出公務'].includes(record.attendance_status)) {
                            attendance_name_set.add(record.user_name);
                            attendance_details.push(record);
                        }
                    });
                    $('#attendance_qty').text(attendance_name_set.size);
                }
            });
    }

    /**
     * 取得今日請假數據
     * 顯示請假人數及詳細資料
     */
    async function get_today_leave_records() {
        const api_url = "http://internal.hochi.org.tw:8082/api/attendance/get_today_leave_record";
        return $.getJSON(api_url, { format: "json" })
            .done(function (data) {
                if (data.length > 0) {
                    $('#leave_qty').text(data.length);
                    leave_details = data;
                    renderLeaveTable(leave_details); // 渲染請假紀錄表格
                }
            });
    }

    // 計算未出勤人數並顯示
    function updateNoAttendanceQty() {
        const total_qty = staff_qty + disciples_qty + secretary_qty + IT_qty; // 總人數
        const attendance_qty = parseInt($('#attendance_qty').text()); // 已出勤人數
        const leave_qty = parseInt($('#leave_qty').text()); // 已請假人數
        /*const no_attendance_qty = total_qty - attendance_qty - leave_qty; // 未出勤人數 = 總人數 - 已出勤人數 - 已請假人數*/

        

        // 計算未出勤人員清單
        const all_persons = [...staff_details, ...disciples_details, ...secretary_details, ...IT_details];
        const attendance_names = new Set(attendance_details.map(record => record.user_name));
        const leave_names = new Set(leave_details.map(record => record.userName));

        // 過濾掉已請假和已出勤人員
        no_attendance_details = all_persons.filter(person =>
            !attendance_names.has(person.person_name) && !leave_names.has(person.person_name)
        );

        $('#no_attendance_qty').text(no_attendance_details.length + '人'); // 顯示未出勤人數
    }

    /**
     * 渲染請假紀錄表格
     * @param {Array} leaveDetails 請假詳細資料
     */
    function renderLeaveTable(leaveDetails) {
        const leaveTable = `
            <table class="leave-table">
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>類型</th>
                        <th>開始時間</th>
                        <th>結束時間</th>
                        <th>時數</th>
                    </tr>
                </thead>
                <tbody>
                    ${leaveDetails.map(detail => `
                        <tr>
                            <td>${detail.userName}<br/> (${detail.userId})</td>
                            <td>${detail.leaveType}</td>
                            <td>${new Date(detail.startTime).toLocaleString('sv', 1).replace(' ', '<br/>')}</td>
                            <td>${new Date(detail.endTime).toLocaleString('sv', 1).replace(' ', '<br/>')}</td>
                            <td>${detail.count_hours} </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        $('.leave-records').html(leaveTable); // 將表格插入到 .leave-records 區域
    }

    // 更新請求審核和休假審批的待簽核數量
    async function updatePendingRequests() {
        const overtimeApiUrl = 'http://internal.hochi.org.tw:8082/api/attendance/waiting_for_approval_of_overtime_record';
        const leaveApiUrl = 'http://internal.hochi.org.tw:8082/api/attendance/waiting_for_approval_of_leave_record';

        // 取得加班待審核數據
        const overtimePendingCount = await $.getJSON(overtimeApiUrl).then(data => {
            return data.filter(item => item.approved_by === null).length;
        });

        // 取得請假待審核數據
        const leavePendingCount = await $.getJSON(leaveApiUrl).then(data => {
            return data.filter(item => item.approved_by === null).length;
        });

        // 更新HTML顯示
        $('#request-review').text(`請求1: 請求審核 (尚有${leavePendingCount}筆待簽核)`);
        $('#leave-approval').text(`請求3: 休假審批 (尚有${overtimePendingCount}筆待簽核)`);
    }

    // 顯示各類別的詳細人員資訊
    function showPersonDetails(details) {
        return details.length > 0
            ? details.map(person => `ID: ${person.person_id}, 姓名: ${person.person_name}`).join("\n")
            : "無人員資料";
    }

    // 顯示出勤詳細人員資料
    function showAttendanceDetails(details) {
        return details.length > 0
            ? details.map(person => `ID: ${person.user_id}, 姓名: ${person.user_name}`).join("\n")
            : "無人員資料";
    }

    // 綁定 hover 事件顯示未出勤人員資訊
    bindHoverEvent('#no_attendance_qty', no_attendance_details);

    // 綁定滑鼠移動事件以顯示人員詳細資訊
    bindHoverEvent('#staff_qty', staff_details);
    bindHoverEvent('#disciples_qty', disciples_details);
    bindHoverEvent('#secretary_qty', secretary_details);
    bindHoverEvent('#IT_qty', IT_details);
    bindHoverEvent('#attendance_qty', attendance_details, showAttendanceDetails);

    // 綁定滑鼠移動事件以顯示請假人員詳細資訊
    $('#leave_qty').hover(
        function () {
            if (leave_details.length > 0) {
                const tooltipText = leave_details.map(detail =>
                    `姓名: ${detail.userName} (${detail.userId})\n類型: ${detail.leaveType}\n時間: ${new Date(detail.startTime).toLocaleString()} - ${new Date(detail.endTime).toLocaleString()}\n時數: ${detail.count_hours} 小時`
                ).join("\n\n");
                $(this).attr('title', tooltipText);
            }
        },
        function () {
            $(this).removeAttr('title');
        }
    );

    // 綁定 hover 事件的共用函數
    function bindHoverEvent(selector, details, displayFn = showPersonDetails) {
        $(selector).hover(
            function () {
                $(this).attr('title', displayFn(details));
            },
            function () {
                $(this).removeAttr('title');
            }
        );
    }


});
