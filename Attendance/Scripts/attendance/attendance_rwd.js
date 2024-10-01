$(document).ready(function () {

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

    // 將日期轉換為當地 ISO 格式
    function toLocalISOString(date) {
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, -1);
        return localISOTime;
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
    // 使用 async/await 發送 API 請求
    async function postApiData_overtime(userID, userName, overtimeType, startTime, endTime, count_hours) {
        const localDate = new Date();
        const localISOString = toLocalISOString(localDate);
        try {
            let response = await $.ajax({
                type: "POST",
                url: "http://internal.hochi.org.tw:8082/api/attendance/appendovetime_record",
                data: JSON.stringify({
                    "userID": userID,
                    "userName": userName,
                    "overtimeType": overtimeType,
                    "startTime": startTime,
                    "endTime": endTime,
                    "count_hours": count_hours,
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
                    "morning_meeting": morning_meeting
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log('會議參與 上傳成功!');
        } catch (error) {
            alert(error);
        }
    }

    // 取得 API 最後打卡狀態
    async function getLastStatus(user_id) {
        const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/get_attendannce_last_status?userid=${user_id}`;
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
            if (status == '下班') {
                //先拜訪API，確認當天是否為應出勤日
                let currentDate = new Date();
                const year = currentDate.getFullYear(); //年份
                const month = currentDate.getMonth() + 1; // 月份從0開始，因此需要加1
                const workingDays = []; // 出勤日 array
                const api_url = `http://internal.hochi.org.tw:8082/api/attendance/get_attendanceDays?calendaryear=${year}&calendarmonth=${month}`;
                const daysData = await $.getJSON(api_url);
                if (daysData.length > 0) {
                    let attendance_days = daysData[0].attendance_days.split(',');
                    workingDays.push(...attendance_days);
                }
                // 取得當天日期 (格式: YYYY-MM-DD)
                const today = new Date();
                const todayString = today.toISOString().split('T')[0];
                // 取得當前時間
                const currentTime = today.getHours() * 60 + today.getMinutes(); // 轉換為分鐘
                const sixThirtyPM = 18 * 60 + 30; // 晚上 6:30 的分鐘表示
                // 判斷條件
                if (!workingDays.includes(todayString) || currentTime > sixThirtyPM) {
                    // 提供加班視窗
                    $("#dialog").dialog("open");
                }
            }
        });
        
    }

    // 初始化函數
    async function defaultLoad() {
        let cookieall = document.cookie;
        console.log(cookieall);

        if (getCookie("person_name") !== "") {
            $('#personal_infor h2').text('姓名: ' + getCookie("person_name"));
            $('#personal_infor p:nth-child(2)').text('區屬: ' + getCookie("person_area"));
            await getLastStatus(getCookie("person_id"));
        }

        if (getCookie("person_ipaddress") !== "") {
            if (getCookie("person_ipaddress").startsWith("10.10.") || getCookie("person_ipaddress").startsWith("192.168.")) {
                $('#inside').show();
                /*$('#outside').hide();*/
                $('#alert').hide();
            } else {
                $('#inside').hide();
                /*$('#outside').show();*/
                $('#alert').hide();
            }
        } else {
            $('#inside').hide();
            /*$('#outside').hide();*/
            $('#alert').show();
        }
    }

    // 頁面加載時初始化
    defaultLoad();
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

                const timeDifference = new Date(end_Date + 'T' + end_Time + ':00') - new Date(start_Date + 'T' + start_Time + ':00');
                let hoursDifference = timeDifference / (1000 * 60 * 60);
                if (hoursDifference > 8) {
                    hoursDifference = 8;
                }

                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                const timeRegex = /^\d{2}:\d{2}$/;

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

                if (isValid) {
                    const postData = {
                        userId: userId,
                        userName: userName,
                        leaveType: leaveType,
                        startTime: start_Date + 'T' + start_Time+':00.000Z',
                        endTime: end_Date + 'T' + end_Time + ':00.000Z',
                        leaveHours: hoursDifference
                    };
                    console.log(postData);
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
                        alert('請假申請成功');
                        $(this).dialog("close");
                    } catch (error) {
                        console.error("Error submitting leave request:", error);
                        alert("請假申請失敗");
                    }
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

                overtimeEntries.each(function (index) {
                    const startTimeString = $(this).find('input[type="time"]').eq(0).val();
                    const endTimeString = $(this).find('input[type="time"]').eq(1).val();

                    if (!startTimeString || !endTimeString) {
                        alert("請選擇加班的起始時間和結束時間!");
                        validEntries = false;
                        return false; // 跳出 .each
                    }

                    // 解析起始時間和結束時間
                    const start_DateTime = new Date();
                    const [startHours, startMinutes] = startTimeString.split(':').map(Number);
                    start_DateTime.setHours(startHours, startMinutes, 0, 0);

                    const end_DateTime = new Date();
                    const [endHours, endMinutes] = endTimeString.split(':').map(Number);
                    end_DateTime.setHours(endHours, endMinutes, 0, 0);

                    // 計算加班小時數
                    const hours = (end_DateTime - start_DateTime) / (1000 * 60 * 60); // 轉換為小時

                    if (hours < 0.5) {
                        alert("每筆加班時間必須超過 0.5 小時!");
                        validEntries = false;
                        return false; // 跳出 .each
                    }

                    totalHours += hours;

                    // POST 請求
                    postApiData_overtime(userId, userName, '加班', start_DateTime, end_DateTime, hours);
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
        const index = $('.overtime-entry').length; // 當前已有的加班時段數量
        const newEntry = `
        <div class="overtime-entry">
            <label for="overtime-start-${index}">請選擇申報加班的起始時間：</label>
            <input type="time" id="overtime-start-${index}" required>
            <label for="overtime-end-${index}">請選擇申報加班的結束時間：</label>
            <input type="time" id="overtime-end-${index}" required>
        </div>
    `;
        $('#overtime-times').append(newEntry); // 在指定區域新增新的加班時段
    });

});
