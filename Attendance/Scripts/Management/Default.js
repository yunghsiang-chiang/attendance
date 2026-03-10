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
    const API_URL = "https://internal.hochi.org.tw:8082/api/attendance/GetPublishedAnnouncements";

    // 人數初始化
    let staff_qty = 0;

    // 詳細資料
    let staff_details = [];
    let attendance_details = [];
    let leave_details = [];
    let no_attendance_details = [];

    // 先取得資料
    await Promise.all([
        get_person_types(),
        get_today_attendance_records(),
        get_today_leave_records(),
        updatePendingRequests()
    ]);

    // 計算未出勤
    updateNoAttendanceQty();

    // 初始化公告
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

            const announcementList = $("#announcement-list");
            announcementList.empty();

            announcements.slice(0, 5).forEach(item => {
                const listItem = `
                    <li class="list-group-item">
                        <strong>${item.title}</strong> (${formatDate(item.issue_time)})
                        <button type="button" class="btn btn-link view-content" data-title="${item.title}" data-content='${item.content}'>查看內容</button>
                    </li>`;
                announcementList.append(listItem);
            });

            $(".view-content").off("click").on("click", function () {
                const title = $(this).data("title");
                const content = $(this).data("content");
                showAnnouncementContent(title, content);
            });

            const allAnnouncementsList = $("#all-announcements-list");
            allAnnouncementsList.empty();

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
     */
    function showAnnouncementContent(title, content) {
        const modalContent = $(`<div>${content}</div>`);

        modalContent.find("img").each(function () {
            $(this).addClass("img-responsive");
        });

        modalContent.dialog({
            title: title,
            modal: true,
            width: "90%",
            maxWidth: 600,
            buttons: {
                關閉: function () {
                    $(this).dialog("close");
                }
            }
        });
    }

    /**
     * 格式化日期
     */
    function formatDate(date) {
        return new Date(date).toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
    }

    /**
     * 取得人員資料
     * 排除 person_type = group
     */
    async function get_person_types() {
        const api_url = "https://internal.hochi.org.tw:8082/api/hochi_learners/get_person_IdNameType";
        return $.getJSON(api_url, { format: "json" })
            .done(function (data) {
                staff_qty = 0;
                staff_details = [];

                data.forEach(person => {
                    if (person.person_type !== "group" && person.person_type !== "chairman") {
                        staff_qty++;
                        staff_details.push(person);
                    }
                });

                updatePersonCount();
                console.log("員工總數(排除group):", staff_qty);
                console.log("員工明細:", staff_details);
            })
            .fail(function (xhr, status, error) {
                console.error("取得人員資料失敗:", status, error);
            });
    }

    /**
     * 更新員工總數顯示
     */
    function updatePersonCount() {
        $('#staff_qty').text(staff_qty + '人');
    }

    /**
     * 取得今日出勤數據
     * 只記錄出勤或外出公務的人員
     */
    async function get_today_attendance_records() {
        const api_url = "https://internal.hochi.org.tw:8082/api/attendance/get_today_attendance_record/";
        return $.getJSON(api_url, { format: "json" })
            .done(function (data) {
                attendance_details = [];

                if (data.length > 0) {
                    const attendance_name_set = new Set();

                    data.forEach(record => {
                        if (!attendance_name_set.has(record.user_name) &&
                            ['到班', '外出公務'].includes(record.attendance_status)) {
                            attendance_name_set.add(record.user_name);
                            attendance_details.push(record);
                        }
                    });

                    $('#attendance_qty').text(attendance_name_set.size + '人');
                } else {
                    $('#attendance_qty').text('0人');
                }
            })
            .fail(function (xhr, status, error) {
                console.error("取得今日出勤資料失敗:", status, error);
                $('#attendance_qty').text('0人');
            });
    }

    /**
     * 取得今日請假數據
     */
    async function get_today_leave_records() {
        const api_url = "https://internal.hochi.org.tw:8082/api/attendance/get_today_leave_record";
        return $.getJSON(api_url, { format: "json" })
            .done(function (data) {
                leave_details = data || [];
                $('#leave_qty').text(leave_details.length + '人');
                renderLeaveTable(leave_details);
            })
            .fail(function (xhr, status, error) {
                console.error("取得今日請假資料失敗:", status, error);
                leave_details = [];
                $('#leave_qty').text('0人');
                renderLeaveTable([]);
            });
    }

    /**
     * 計算未出勤人數
     */
    function updateNoAttendanceQty() {
        const all_persons = staff_details;
        const attendance_names = new Set(attendance_details.map(record => record.user_name));
        const leave_names = new Set(leave_details.map(record => record.userName));

        no_attendance_details = all_persons.filter(function (person) {
            return !attendance_names.has(person.person_name) &&
                !leave_names.has(person.person_name);
        });

        $('#no_attendance_qty').text(no_attendance_details.length + '人');
    }

    /**
     * 渲染請假紀錄表格
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
                            <td>${detail.userName}<br/>(${detail.userId})</td>
                            <td>${detail.leaveType}</td>
                            <td>${new Date(detail.startTime).toLocaleString('sv', 1).replace(' ', '<br/>')}</td>
                            <td>${new Date(detail.endTime).toLocaleString('sv', 1).replace(' ', '<br/>')}</td>
                            <td>${detail.count_hours}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        $('.leave-records').html(leaveTable);
    }

    /**
     * 更新待簽核數量
     */
    async function updatePendingRequests() {
        const overtimeApiUrl = 'https://internal.hochi.org.tw:8082/api/attendance/waiting_for_approval_of_overtime_record';
        const leaveApiUrl = 'https://internal.hochi.org.tw:8082/api/attendance/waiting_for_approval_of_leave_record';

        const overtimePendingCount = await $.getJSON(overtimeApiUrl).then(function (data) {
            return data.filter(function (item) {
                return item.approved_by === null;
            }).length;
        });

        const leavePendingCount = await $.getJSON(leaveApiUrl).then(function (data) {
            return data.filter(function (item) {
                return item.approved_by === null;
            }).length;
        });

        $('#request-review').text(`請求1: 請求審核 (尚有${leavePendingCount}筆待簽核)`);
        $('#leave-approval').text(`請求3: 休假審批 (尚有${overtimePendingCount}筆待簽核)`);
    }

    /**
     * 顯示一般人員詳細資訊
     */
    function showPersonDetails(details) {
        return details.length > 0
            ? details.map(function (person) {
                return `ID: ${person.person_id}, 姓名: ${person.person_name}`;
            }).join("\n")
            : "無人員資料";
    }

    /**
     * 顯示出勤詳細資訊
     */
    function showAttendanceDetails(details) {
        return details.length > 0
            ? details.map(function (person) {
                return `ID: ${person.user_id}, 姓名: ${person.user_name}`;
            }).join("\n")
            : "無人員資料";
    }

    /**
     * 請假 tooltip / click 共用文字
     */
    function getLeaveTooltipText() {
        if (leave_details.length === 0) return "無請假資料";

        return leave_details.map(function (detail) {
            return `姓名: ${detail.userName} (${detail.userId})\n` +
                `類型: ${detail.leaveType}\n` +
                `時間: ${new Date(detail.startTime).toLocaleString()} - ${new Date(detail.endTime).toLocaleString()}\n` +
                `時數: ${detail.count_hours} 小時`;
        }).join("\n\n");
    }

    /**
     * 綁定 click 事件
     */
    function bindClickEvent(selector, getTextFn) {
        var $target = $(selector);
        var $group = $target.closest('.form-group');

        $group.css('cursor', 'pointer');

        $group.off('click').on('click', function () {
            var text = getTextFn();
            if (!text || !String(text).trim()) return;
            alert(text);
        });
    }

    // 綁定 click：改成用函式動態取最新資料
    bindClickEvent('#staff_qty', function () {
        return showPersonDetails(staff_details);
    });

    bindClickEvent('#attendance_qty', function () {
        return showAttendanceDetails(attendance_details);
    });

    bindClickEvent('#no_attendance_qty', function () {
        return showPersonDetails(no_attendance_details);
    });

    bindClickEvent('#leave_qty', function () {
        return getLeaveTooltipText();
    });

    // 請假 hover
    $('#leave_qty').hover(
        function () {
            const tooltipText = getLeaveTooltipText();
            if (leave_details.length > 0) {
                $(this).attr('title', tooltipText);
            }
        },
        function () {
            $(this).removeAttr('title');
        }
    );
});