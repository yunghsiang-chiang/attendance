$(document).ready(function () {
    // 兩位小數
    const fmt2 = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n.toFixed(2) : '0.00';
    };

    // 年資用與周年視窗計算（365.2425 天/年）
    const yearsBetween = (start, end) => {
        const ms = new Date(end) - new Date(start);
        return ms / (365.2425 * 24 * 60 * 60 * 1000);
    };

    // 🕘 上班時間與午休時間（分鐘）
    const WORK_START_MIN = 9 * 60;          // 09:00
    const WORK_END_MIN = 18 * 60;         // 18:00
    const LUNCH_START_MIN = 12 * 60 + 30;   // 12:30
    const LUNCH_END_MIN = 13 * 60 + 30;   // 13:30

    // 取得 cookie 值
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(/&|;/);
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // 設置 cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = " expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // 刪除 cookie
    function deleteCookie(name) {
        setCookie(name, "", -1);
    }

    // 將當地時間轉換為 ISO 格式 (不轉換為 UTC)
    function toLocalISOString(date) {
        const offset = date.getTimezoneOffset() * 60000; // 當前時區的偏移量，分鐘轉毫秒
        const localTime = new Date(date.getTime() - offset); // 減去偏移量來獲取當地時間
        return localTime.toISOString().slice(0, -1); // 去掉 'Z' 後的 ISO 格式
    }

    // 計算請假起訖之間的實際工作時數（只算週一～週五，09:00~18:00，扣掉 12:30~13:30）
    function calcWorkHoursBetween(startDateTime, endDateTime) {
        if (!(startDateTime instanceof Date) || !(endDateTime instanceof Date)) return 0;
        if (endDateTime <= startDateTime) return 0;

        let totalMinutes = 0;

        // 取起始「日期」(00:00) 與結束「日期」(00:00)
        let cur = new Date(startDateTime);
        cur.setHours(0, 0, 0, 0);

        const lastDay = new Date(endDateTime);
        lastDay.setHours(0, 0, 0, 0);

        while (cur <= lastDay) {
            const dow = cur.getDay(); // 0=Sun, 6=Sat

            // 只算週一～週五
            if (dow !== 0 && dow !== 6) {
                // 當天的上班時間區段：09:00~18:00
                const dayWorkStart = new Date(cur);
                dayWorkStart.setHours(9, 0, 0, 0);

                const dayWorkEnd = new Date(cur);
                dayWorkEnd.setHours(18, 0, 0, 0);

                // 與整體請假區間交集
                const segStart = new Date(Math.max(dayWorkStart.getTime(), startDateTime.getTime()));
                const segEnd = new Date(Math.min(dayWorkEnd.getTime(), endDateTime.getTime()));

                if (segEnd > segStart) {
                    let minutes = (segEnd - segStart) / 60000; // 轉分鐘

                    // 扣掉午休 12:30~13:30 的重疊
                    const lunchStart = new Date(cur);
                    lunchStart.setHours(12, 30, 0, 0);
                    const lunchEnd = new Date(cur);
                    lunchEnd.setHours(13, 30, 0, 0);

                    const lStart = Math.max(lunchStart.getTime(), segStart.getTime());
                    const lEnd = Math.min(lunchEnd.getTime(), segEnd.getTime());
                    if (lEnd > lStart) {
                        minutes -= (lEnd - lStart) / 60000;
                    }

                    if (minutes > 0) {
                        totalMinutes += minutes;
                    }
                }
            }

            // 下一天
            cur.setDate(cur.getDate() + 1);
        }

        return totalMinutes / 60.0; // 轉成小時
    }

    // 加載公告清單
    async function loadAnnouncements() {
        try {
            const response = await fetch('http://internal.hochi.org.tw:8082/api/attendance/GetPublishedAnnouncements');
            if (!response.ok) throw new Error('公告清單加載失敗');
            const announcements = (await response.json()).$values || [];

            // 清空現有清單
            $('#announcementList').empty();

            announcements.forEach(announcement => {
                const listItem = $(`
                    <li class="list-group-item" data-id="${announcement.announcement_id}">
                        ${announcement.title}
                    </li>
                `);

                // 點擊事件顯示詳細資訊
                listItem.on('click', function () {
                    $('#modalTitle').text(announcement.title);
                    $('#modalContent').html(announcement.content);
                    $('#modalStartTime').text(new Date(announcement.start_time).toLocaleString());
                    $('#modalEndTime').text(new Date(announcement.end_time).toLocaleString());
                    $('#modalAuthor').text(announcement.author);
                    $('#announcementModal').modal('show');
                });

                $('#announcementList').append(listItem);
            });
        } catch (error) {
            console.error('公告清單加載失敗:', error);
        }
    }

    // 使用 async/await 發送 API 請求
    async function postApiData(user_id, user_name, attendance_status) {
        const localDate = new Date();
        const localISOString = toLocalISOString(localDate);
        try {
            let response = await $.ajax({
                type: "POST",
                url: "http://internal.hochi.org.tw:8082/api/attendance/appendattendance_record",
                data: JSON.stringify({
                    "user_id": user_id,
                    "user_name": user_name,
                    "attendance_status": attendance_status,
                    "create_time": localISOString
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            alert('狀態 ' + attendance_status + ' 上傳成功!');
        } catch (error) {
            console.log(error);
        }
    }

    // 使用 async/await 發送加班 API 請求
    async function postApiData_overtime(userID, userName, overtimeType, startTime, endTime, count_hours, remark) {
        const localDate = new Date();
        const localISOString = toLocalISOString(localDate); // 使用本地時間
        try {
            let response = await $.ajax({
                type: "POST",
                url: "http://internal.hochi.org.tw:8082/api/attendance/appendovetime_record",
                data: JSON.stringify({
                    "userID": userID,
                    "userName": userName,
                    "overtimeType": overtimeType,
                    "startTime": startTime, // 使用原始的當地時間
                    "endTime": endTime, // 使用原始的當地時間
                    "count_hours": count_hours,
                    "remark": remark, // 傳遞備註
                    "submitted_at": localISOString
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            alert('加班 上傳成功!');
        } catch (error) {
            console.log(error);
        }
    }

    // 發送會議數據的 API 請求
    async function postApiDataMeeting() {
        const localDate = new Date();
        const localISOString = toLocalISOString(localDate);
        const user_id = getCookie("person_id");
        const user_name = getCookie("person_name");
        let morning_light_up = document.querySelector("#cb_morning_up_in_hochi").checked ? 1 : 0;
        let morning_light_down = document.querySelector("#cb_morning_down_in_hochi").checked ? 1 : 0;
        let morning_meeting = document.querySelector("#cb_morning_meetnig_in_hochi").checked ? 1 : 0;
        let morning_light_down_after_purple_light = document.querySelector("#cb_morning_down_after_purple_light_in_hochi").checked ? 1 : 0;
        //morning_light_down_after_purple_light
        try {
            await $.ajax({
                type: "POST",
                url: "http://internal.hochi.org.tw:8082/api/attendance/appendattendance_day",
                data: JSON.stringify({
                    "user_id": user_id,
                    "user_name": user_name,
                    "attendance_day": localISOString,
                    "morning_light_up": morning_light_up,
                    "morning_light_down": morning_light_down,
                    "morning_meeting": morning_meeting,
                    "morning_light_down_after_purple_light": morning_light_down_after_purple_light
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log('會議參與 上傳成功!');
            console.log(morning_light_down_after_purple_light);
        } catch (error) {
            alert(error);
        }
    }

    // 取得 API 最後打卡狀態
    async function getLastStatus(user_id) {
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendance_last_status?userid=${user_id}`;
        try {
            let detailResponse = await $.ajax({
                url: apiUrl,
                type: 'GET',
            });
            if (detailResponse.attendance_status != "string") {
                $('#personal_infor p:nth-child(3)').text('目前打卡狀態: ' + detailResponse.attendance_status);
            } else {
                $('#personal_infor p:nth-child(3)').text('目前打卡狀態: 無');
            }
        } catch (error) {
            console.error('Error fetching attendance details:', error);
        }
    }

    // 取得並顯示個人剩餘 特休/事假/病假（到職週年視窗扣抵近一年請假）
    async function loadPersonalLeaveBalances() {
        const personId = getCookie("person_id");
        const personName = getCookie("person_name");
        if (!personId) return;

        try {
            // 1) 取得可用時數（特休/事假/病假）
            const vRes = await fetch('http://internal.hochi.org.tw:8082/api/attendance/get_person_vacation');
            if (!vRes.ok) throw new Error('get_person_vacation 失敗');
            const vJson = await vRes.json();
            const list = (vJson && vJson.$values) ? vJson.$values : [];
            const me = list.find(x => String(x.person_id) === String(personId));
            if (!me) return;

            // 初始（API 提供的一年可用時數）
            let remainSpecial = Number(me.special_vacation_hours) || 0;
            let remainPersonal = Number(me.personal_leave_hours) || 0;
            let remainSick = Number(me.personal_sick_hours) || 0;

            // 2) 取得近一年請假紀錄，用到職週年視窗扣抵
            const lRes = await fetch('http://internal.hochi.org.tw:8082/api/attendance/get_leave_record_last_year');
            if (!lRes.ok) throw new Error('get_leave_record_last_year 失敗');
            const records = await lRes.json();

            const now = new Date();
            const startWorkDate = new Date(me.start_work || now);
            const anniversaryThisYear = new Date(startWorkDate);
            anniversaryThisYear.setFullYear(now.getFullYear());
            if (now < anniversaryThisYear) {
                anniversaryThisYear.setFullYear(now.getFullYear() - 1);
            }
            const nextAnniversary = new Date(anniversaryThisYear);
            nextAnniversary.setFullYear(anniversaryThisYear.getFullYear() + 1);

            // 只處理本人、且落在週年視窗的請假
            (Array.isArray(records) ? records : []).forEach(r => {
                if (String(r.userId) !== String(personId)) return;
                const st = new Date(r.startTime);
                if (st < anniversaryThisYear || st > nextAnniversary) return;
                const hrs = Number(r.count_hours) || 0;
                if (r.leaveType === '特休') remainSpecial -= hrs;
                if (r.leaveType === '事假') remainPersonal -= hrs;
                if (r.leaveType === '病假') remainSick -= hrs;
            });

            // 3) 將結果渲染到 personal_infor
            // 若尚未有容器就建立一個
            if (!document.getElementById('personal_balances')) {
                const wrap = document.createElement('div');
                wrap.id = 'personal_balances';
                wrap.style.marginTop = '6px';
                // 追加到 #personal_infor 內文最後
                document.getElementById('personal_infor')?.appendChild(wrap);
            }
            const el = document.getElementById('personal_balances');
            el.innerHTML = `
      <p>剩餘特休時數：<strong>${fmt2(remainSpecial)}</strong> 小時</p>
      <p>剩餘事假時數：<strong>${fmt2(remainPersonal)}</strong> 小時</p>
      <p>剩餘病假時數：<strong>${fmt2(remainSick)}</strong> 小時</p>
    `;
        } catch (err) {
            console.error('loadPersonalLeaveBalances error:', err);
        }
    }

    // 處理按鈕點擊事件
    async function handleButtonClick(selector, status) {
        $(selector).click(async function () {
            setCookie('last_status', status, 1);
            setCookie('attendance_state', status, 1);
            setCookie('start', new Date().toLocaleString('sv'), 1);
            $('#personal_infor p:nth-child(3)').text('目前打卡狀態:' + status);

            await postApiData(getCookie("person_id"), getCookie("person_name"), status);

            const checkboxes = document.querySelectorAll('#attended_inside_meetings input[type="checkbox"]');
            let selectedCheckboxes = Array.from(checkboxes).some(checkbox => checkbox.checked);
            if (selectedCheckboxes) {
                await postApiDataMeeting();
            }

            // 額外考慮，加班，透過下班按鈕觸發
            // 2024/12/24 同修護持美國班會，經常跨夜加班，取消檢查機制
            if (status == '下班') {
                $("#dialog").dialog("open");
                //let currentDate = new Date();
                //const year = currentDate.getFullYear();
                //const month = currentDate.getMonth() + 1;
                //const workingDays = [];
                //const api_url = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDays?calendaryear=${year}&calendarmonth=${month}`;
                //const daysData = await $.getJSON(api_url);
                //if (daysData.length > 0) {
                //    let attendance_days = daysData[0].attendance_days.split(',');

                //    attendance_days = attendance_days.map(day => {
                //        let parts = day.split('-');
                //        let formattedMonth = parts[1].padStart(2, '0');
                //        let formattedDay = parts[2].padStart(2, '0');
                //        return `${parts[0]}-${formattedMonth}-${formattedDay}`;
                //    });

                //    workingDays.push(...attendance_days);
                //}
                //const currentTime = today.getHours() * 60 + today.getMinutes();
                //const sixThirtyPM = 18 * 60 + 30;

                //if (!workingDays.includes(todayString) || currentTime > sixThirtyPM) {
                //    $("#dialog").dialog("open");
                //}
            }
        });
    }

    // 頁面加載時初始化
    async function defaultLoad() {
        let cookieall = document.cookie;

        if (getCookie("person_name") !== "") {
            $('#personal_infor h2').text('姓名: ' + getCookie("person_name"));
            $('#personal_infor p:nth-child(2)').text('區屬: ' + getCookie("person_area"));
            await getLastStatus(getCookie("person_id"));
            await loadPersonalLeaveBalances();
        }

        if (getCookie("person_ipaddress") !== "") {
            if (getCookie("person_ipaddress").startsWith("10.10.") || getCookie("person_ipaddress").startsWith("192.168.")) {
                $('#inside').show();
                $('#alert').hide();
            } else {
                $('#inside').show();
                $('#alert').hide();
            }
        } else {
            $('#inside').hide();
            $('#alert').show();
        }
    }

    // 頁面加載時初始化
    defaultLoad();

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    // 初始加載公告清單
    loadAnnouncements();
    handleButtonClick('#bt_start', '到班');
    handleButtonClick('#bt_end', '下班');
    handleButtonClick('#bt_going_out_on_business', '外出公務');
    handleButtonClick('#bt_come_back', '回崗');
    handleButtonClick('#bt_outside_business', '外出公務');
    handleButtonClick('#bt_sick_leave', '請病假');
    handleButtonClick('#bt_menstrual_leave', '請生理假');
    handleButtonClick('#bt_personal_leave', '請事假');
    handleButtonClick('#bt_compensatory_leave', '補休');
    handleButtonClick('#bt_specaial_leave', '特休');

    function setOvertimeDefaultDates(scope) {
        const dateValue = new Date().toISOString().split('T')[0];
        const container = scope || $(document);

        container.find('.overtime-start-date').each(function () {
            if (!$(this).val()) {
                $(this).val(dateValue);
            }
        });

        container.find('.overtime-end-date').each(function () {
            if (!$(this).val()) {
                $(this).val(dateValue);
            }
        });
    }

    // 根據當前時間限制每個時間選擇器
    function updateTimeLimit() {
        let currentHour = new Date().getHours();
        let maxTime = (currentHour < 10 ? "0" : "") + currentHour + ":59";
        $('input[type="time"]').attr("max", maxTime);
    }

    // 初始化請假對話框
    $("#dialog-form").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "確認": async function () {
                let isValid = true;
                let leaveType = $("#leave-type").val();
                let start_Date = $("#start-date").val();
                let start_Time = $("#start-time").val();
                let end_Date = $("#end-date").val();
                let end_Time = $("#end-time").val();
                let userId = getCookie("person_id");
                let userName = getCookie("person_name");
                const localISOString = toLocalISOString(new Date());

                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                const timeRegex = /^\d{2}:\d{2}$/;

                // ===== 基本欄位檢查 =====
                if (!leaveType) {
                    alert("請選擇請假類型");
                    isValid = false;
                }
                if (!dateRegex.test(start_Date)) {
                    alert("開始日期格式不正確，請使用 YYYY-MM-DD 格式");
                    isValid = false;
                }
                if (!timeRegex.test(start_Time)) {
                    alert("開始時間格式不正確，請使用 HH:mm 格式");
                    isValid = false;
                }
                if (!dateRegex.test(end_Date)) {
                    alert("結束日期格式不正確，請使用 YYYY-MM-DD 格式");
                    isValid = false;
                }
                if (!timeRegex.test(end_Time)) {
                    alert("結束時間格式不正確，請使用 HH:mm 格式");
                    isValid = false;
                }

                if (new Date(start_Date) > new Date(end_Date)) {
                    alert("開始日期不能晚於結束日期！");
                    isValid = false;
                }

                if (!isValid) {
                    return;
                }

                // 建立 Date 物件
                let startDateTime = new Date(`${start_Date}T${start_Time}:00`);
                let endDateTime = new Date(`${end_Date}T${end_Time}:00`);

                // 再次防呆：整體起迄不可相同或倒退（避免 count_hours 為負數或 0）
                if (endDateTime <= startDateTime) {
                    alert("結束時間必須晚於開始時間！");
                    return;
                }

                // ⭐ 關鍵：統一用函式計算（自動處理單日/跨日、扣週末、扣午休）
                let hoursDifference = calcWorkHoursBetween(startDateTime, endDateTime);

                // 再次保險：不接受 0 或負數
                if (hoursDifference <= 0) {
                    alert("計算出的請假時數不合理（小於等於 0），請重新確認時間區間。\n(提示：請確認時間是否落在 週一～週五 09:00~18:00 之內)");
                    return;
                }

                const postData = {
                    userId: userId,
                    userName: userName,
                    leaveType: leaveType,
                    startTime: `${start_Date}T${start_Time}:00.000Z`,
                    endTime: `${end_Date}T${end_Time}:00.000Z`,
                    count_hours: hoursDifference,
                    submitted_at: localISOString
                };

                try {
                    let response = await $.ajax({
                        type: "POST",
                        url: "http://internal.hochi.org.tw:8082/api/attendance/appendleave_record",
                        data: JSON.stringify(postData),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(response);
                    alert(`請假申請成功，系統計算時數：${hoursDifference.toFixed(2)} 小時`);
                    $(this).dialog("close");
                } catch (error) {
                    console.error("Error submitting leave request:", error);
                    alert("請假申請失敗");
                }
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });

    // 打開請假對話框
    $("#bt_dayoff").click(function () {
        $("#dialog-form").dialog("open");
    });

    // 加班對話框初始化
    // 修正加班邏輯，去掉 UTC 轉換
    $('#dialog').dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "確認": function () {
                const userId = getCookie("person_id");
                const userName = getCookie("person_name");
                const overtimeEntries = $('.overtime-entry');

                let totalHours = 0;
                let validEntries = true;
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                const timeRegex = /^\d{2}:\d{2}$/;

                overtimeEntries.each(function (index) {
                    const startDateString = $(this).find('.overtime-start-date').val();
                    const startTimeString = $(this).find('.overtime-start-time').val();
                    const endDateString = $(this).find('.overtime-end-date').val();
                    const endTimeString = $(this).find('.overtime-end-time').val();
                    const remark = $(this).find('textarea').val(); // 獲取備註內容

                    if (!dateRegex.test(startDateString) || !timeRegex.test(startTimeString)) {
                        alert("請選擇正確的加班起始日期與時間!");
                        validEntries = false;
                        return false;
                    }

                    if (!dateRegex.test(endDateString) || !timeRegex.test(endTimeString)) {
                        alert("請選擇正確的加班結束日期與時間!");
                        validEntries = false;
                        return false;
                    }

                    const start_DateTime = new Date(`${startDateString}T${startTimeString}:00`);
                    const end_DateTime = new Date(`${endDateString}T${endTimeString}:00`);

                    if (!(start_DateTime instanceof Date) || Number.isNaN(start_DateTime.getTime())) {
                        alert("加班起始時間無法解析，請重新輸入。");
                        validEntries = false;
                        return false;
                    }

                    if (!(end_DateTime instanceof Date) || Number.isNaN(end_DateTime.getTime())) {
                        alert("加班結束時間無法解析，請重新輸入。");
                        validEntries = false;
                        return false;
                    }

                    if (end_DateTime <= start_DateTime) {
                        alert("加班結束時間必須晚於起始時間！");
                        validEntries = false;
                        return false;
                    }

                    const hours = (end_DateTime - start_DateTime) / (1000 * 60 * 60);

                    if (hours < 0.5) {
                        alert("每筆加班時間必須超過 0.5 小時!");
                        validEntries = false;
                        return false;
                    }

                    totalHours += hours;

                    // 發送 API 請求 (不再轉換為 UTC)
                    postApiData_overtime(userId, userName, '加班', toLocalISOString(start_DateTime), toLocalISOString(end_DateTime), hours, remark);

                });

                if (validEntries) {
                    alert(`成功申報 ${overtimeEntries.length} 筆加班時段，共計 ${totalHours} 小時`);
                    $(this).dialog("close");
                }
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });

    // 新增加班時段
    $('#add-overtime').on('click', function () {
        const index = $('.overtime-entry').length;
        const newEntry = `
        <div class="overtime-entry">
            <label for="overtime-start-date-${index}">請選擇申報加班的起始日期：</label>
            <input type="date" id="overtime-start-date-${index}" class="overtime-start-date" required>
            <label for="overtime-start-${index}">請選擇申報加班的起始時間：</label>
            <input type="time" id="overtime-start-${index}" class="overtime-start-time" required>
            <label for="overtime-end-date-${index}">請選擇申報加班的結束日期：</label>
            <input type="date" id="overtime-end-date-${index}" class="overtime-end-date" required>
            <label for="overtime-end-${index}">請選擇申報加班的結束時間：</label>
            <input type="time" id="overtime-end-${index}" class="overtime-end-time" required>
            <label for="overtime-remark-${index}">備註：</label>
            <textarea id="overtime-remark-${index}" class="form-control" rows="2" placeholder="加班原因或說明"></textarea>
        </div>
        `;
        $('#overtime-times').append(newEntry);
        setOvertimeDefaultDates($('#overtime-times'));
    });

    // 初始調用限制時間
    updateTimeLimit();
    setOvertimeDefaultDates($('#overtime-times'));

    // 每次新增加班或請假時段時，為其設置時間限制
    $(document).on('change', 'input[type="time"]', function () {
        updateTimeLimit();
    });

});
