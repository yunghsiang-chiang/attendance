﻿//doucment ready event
$(document).ready(function () {

    let cookieall = document.cookie;
    console.log(cookieall);
    //拜訪cookie 個人資料
    if (getCookie("person_name") != "") {
        //更換姓名資訊
        $('#personal_infor h2').text('姓名:' + getCookie("person_name"));
        //區屬
        $('#personal_infor p:nth-child(2)').text('區屬:' + getCookie("person_area"));
    }
    //拜訪cookie 最後打卡狀態
    if (getCookie("last_status") != "") {
        //最後狀態修正
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:' + getCookie("last_status"));
    } else {
        //最後狀態修正
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:無');
    }
    //ip位置 決定慈場選項 或 外出公務
    if (getCookie("person_ipaddress") != "") {
        if (getCookie("person_ipaddress").startsWith("10.10.") || getCookie("person_ipaddress").startsWith("192.168.")) {
            $('#inside').show();
            $('#outside').hide();
            $('#alert').hide();
        } else {
            $('#inside').hide();
            $('#outside').show();
            $('#alert').hide();
        }
    } else {
        $('#inside').hide();
        $('#outside').hide();
        $('#alert').show();
    }

    //到班 button
    //2024/9/16 追加邏輯 檢查當天是否為出勤日，為了方便加速使用，資訊由後台!IsPostBack丟入cookie
    $('#bt_start').click(function () {
        setCookie('last_status', '到班', 1);
        setCookie('attendance_state', '到班', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:到班');
        postapidata(getCookie("person_id"), getCookie("person_name"), "到班");
        //如果晚上6點之後才按了到班
        // 獲取當前時間
        const now = new Date();
        // 創建一個表示今晚 6 點的時間
        const targetTime = new Date(now);

        if (getCookie("attendance_days") != '') {
            const d = new Date();
            let text = d.toLocaleString().split(' ')[0].replace('/', '-').replace('/', '-');
            let temp_dates = getCookie("attendance_days").split('.');
            let temp_dates_set = new Set(temp_dates);
            if (!temp_dates_set.has(text)) { //休假日
                //休假日 target不動，使最後的cookie['overtimein'] = 當下時間
            } else { //出勤日
                targetTime.setHours(18, 0, 0, 0); // 設定為18點，分鐘、秒鐘、毫秒都是0
            } 
        } else {
            targetTime.setHours(18, 0, 0, 0); // 設定為18點，分鐘、秒鐘、毫秒都是0
        }
        // 計算時間差，單位為毫秒
        const timeDifferenceMs = now - targetTime;
        // 將時間差轉換為小時數（包括正負值）
        const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
        if (timeDifferenceHours >= 0) {
            // 計算今天晚上 23:59:59 的時間
            const expires = new Date();
            let d = expires.toLocaleString('sv',1)
            expires.setHours(23, 59, 59, 999);  // 設置為 23:59:59.999
            // 設置 cookie 的過期時間
            const expiresStr = expires.toUTCString();
            // 設置 cookie
            document.cookie = `overtimein=` + d +`; expires=${expiresStr}; path=/`;
        }
    });
    //下班 button
    //2024/9/16 追加邏輯 當天非出勤日，彈性設定 方案A 補休+平日薪水 方案B 加班費用
    $('#bt_end').click(function () {
        setCookie('last_status', '下班', 1);
        setCookie('attendance_state', '下班', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:下班');
        postapidata(getCookie("person_id"), getCookie("person_name"), "下班");
        //檢查下班時間>半小時以上，彈跳申請加班頁面
        //獲取當前時間
        const now = new Date();
        // 創建一個表示今晚 6 點的時間
        let targetTime = new Date(now);
        targetTime.setHours(18, 0, 0, 0); // 設定為18點，分鐘、秒鐘、毫秒都是0
        //如果下班後還登入繼續作業
        console.log(getCookie('overtimein'));

        if (getCookie('overtimein') != '') {
            // 原始字串 2024-09-11 18:59:54
            const dateString = getCookie('overtimein');
            // 將字串分割為日期和時間部分
            const [datePart, timePart] = dateString.split(' ');
            // 將日期部分分割為年、月、日
            const [year, month, day] = datePart.split('-').map(Number);
            // 將時間部分分割為時、分、秒
            const [hours, minutes, seconds] = timePart.split(':').map(Number);
            // 複寫targetTime: month-1，因 month 從0~11 表示 1~12月...很搞
            targetTime = new Date(year, month - 1, day, hours, minutes, seconds);
        }
        // 計算時間差，單位為毫秒
        const timeDifferenceMs = now - targetTime;
        // 將時間差轉換為小時數（包括正負值）
        const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
        if (timeDifferenceHours >= 0.5) {
            $("#dialog").dialog("open");
            $('#overtime-hours').attr('max', timeDifferenceHours);
        }

    });
    //外出公務
    $('#bt_going_out_on_business').click(function () {
        setCookie('last_status', '外出公務', 1);
        setCookie('attendance_state', '外出公務', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:外出公務');
        postapidata(getCookie("person_id"), getCookie("person_name"), "外出公務");
    });
    //回崗
    $('#bt_come_back').click(function () {
        setCookie('last_status', '回崗', 1);
        setCookie('attendance_state', '回崗', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:回崗');
        postapidata(getCookie("person_id"), getCookie("person_name"), "回崗");
    });
    
    //外出公務
    $('#bt_outside_business').click(function () {
        setCookie('last_status', '外出公務', 1);
        setCookie('attendance_state', '外出公務', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:外出公務');
        postapidata(getCookie("person_id"), getCookie("person_name"), "外出公務");
    });
    //請病假
    $('#bt_sick_leave').click(function () {
        setCookie('last_status', '請病假', 1);
        setCookie('attendance_state', '請病假', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:請病假');
        postapidata(getCookie("person_id"), getCookie("person_name"), "請病假");
    });
    //請生理假
    $('#bt_menstrual_leave').click(function () {
        setCookie('last_status', '請生理假', 1);
        setCookie('attendance_state', '請生理假', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:請生理假');
        postapidata(getCookie("person_id"), getCookie("person_name"), "請生理假");
    });
    //請事假
    $('#bt_personal_leave').click(function () {
        setCookie('last_status', '請事假', 1);
        setCookie('attendance_state', '請事假', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:請事假');
        postapidata(getCookie("person_id"), getCookie("person_name"), "請事假");
    });
    //補休
    $('#bt_compensatory_leave').click(function () {
        setCookie('last_status', '補休', 1);
        setCookie('attendance_state', '補休', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:補休');
        postapidata(getCookie("person_id"), getCookie("person_name"), "補休");
    });
    //特休
    $('#bt_specaial_leave').click(function () {
        setCookie('last_status', '特休', 1);
        setCookie('attendance_state', '特休', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:特休');
        postapidata(getCookie("person_id"), getCookie("person_name"), "特休");
    });

    //請假
    // 點擊按鈕打開對話框
    $('#bt_dayoff').click(function () {
        setCookie('last_status', '請假', 1);
        setCookie('attendance_state', '請假', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:請假');
        //postapidata(getCookie("person_id"), getCookie("person_name"), "請假");
        $("#dialog-form").dialog("open");
        
    });


    // 初始化請假對話框
    $("#dialog-form").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "確認": function () {
                // 表單驗證
                var isValid = true;
                var leaveType = $("#leave-type").val();
                var start_Date = $("#start-date").val();
                var start_Time = $("#start-time").val();
                var end_Date = $("#end-date").val();
                var end_Time = $("#end-time").val();
                var userId = getCookie("person_id");
                var userName = getCookie("person_name");

                // 計算時間差（毫秒）
                const timeDifference = new Date(end_Date + 'T' + end_Time + ':00') - new Date(start_Date + 'T' + start_Time + ':00');

                // 將時間差轉換為小時數
                let hoursDifference = timeDifference / (1000 * 60 * 60);

                //超過8小時則鎖定8小時
                if (hoursDifference>8) {
                    hoursDifference = 8;
                }

                // 檢查請假類型是否選擇
                if (!leaveType) {
                    alert("請選擇請假類型");
                    isValid = false;
                }

                // 檢查日期和時間格式
                var dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 格式
                var timeRegex = /^\d{2}:\d{2}$/; // HH:mm 格式

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
                    // 構建要發送的數據
                    var postData = {
                        userId: userId,
                        userName: userName,
                        leaveType: leaveType,
                        startTime: start_Date + 'T' + start_Time+':00.000Z',
                        endTime: end_Date + 'T' + end_Time + ':00.000Z',
                        count_hours: hoursDifference
                    };

                    // 發送 POST 請求
                    $.ajax({
                        url: 'http://internal.hochi.org.tw:8082/api/attendance/appendleave_record', // API 端點 URL
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(postData),
                        success: function (response) {
                            alert("請假申請已成功提交！");
                            $("#dialog-form").dialog("close");
                        },
                        error: function (xhr, status, error) {
                            alert("提交失敗: " + xhr.responseText);
                        }
                    });
                }
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });
    // 初始化加班對話框
    $('#dialog').dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "確認": function () {
                // 表單驗證
                var userId = getCookie("person_id");
                var userName = getCookie("person_name");
                var evening6 = new Date();
                evening6.setHours(18, 0, 0, 0); // 設置到晚上6點
                if (getCookie('overtimein') != '') {
                    // 原始字串 2024-09-11 18:59:54
                    const dateString = getCookie('overtimein');
                    // 將字串分割為日期和時間部分
                    const [datePart, timePart] = dateString.split(' ');
                    // 將日期部分分割為年、月、日
                    const [year, month, day] = datePart.split('-').map(Number);
                    // 將時間部分分割為時、分、秒
                    const [hours, minutes, seconds] = timePart.split(':').map(Number);
                    // 複寫targetTime: month-1，因 month 從0~11 表示 1~12月...很搞
                    targetTime = new Date(year, month - 1, day, hours, minutes, seconds);
                }
                var diff6 = (Date.now() - evening6) / (1000 * 60 * 60); // 距離晚上6點的差距，單位：小時
                //檢查數值為整數或浮點數，且不可為負數
                var isValid = isValidNumber(diff6);
                var count_hours = parseFloat($('#overtime-hours').val());
                var start_Date = new Date(Date.now()).toLocaleString('sv', 1).split(' ')[0]; //注意!Date.now()取得number格式!
                var start_Time = ' 18:00';
                //如果下班後還登入繼續作業
                if (getCookie('overtimein') != '') {
                    // 原始字串 2024-09-11 18:59:54
                    const dateString = getCookie('overtimein');
                    start_Date = dateString.split(' ')[0];
                    start_Time = dateString.split(' ')[1].substring(0,5);
                }
                // 合併日期和時間為一個 ISO 字符串
                var start_DateTime = new Date(start_Date + start_Time);
                // 複製一個新的 Date 物件來避免更改原始 start_DateTime
                var end_DateTime = new Date(start_DateTime.getTime());
                // 計算結束時間，添加指定的時間小時數
                end_DateTime.setHours(end_DateTime.getHours() + count_hours);
                //轉換成JSON格式時間
                var start_DateTime_JS = start_DateTime.toLocaleString('sv', 1).replace(' ', 'T') + 'Z';

                var end_DateTime_JS = end_DateTime.toLocaleString('sv', 1).replace(' ', 'T') + 'Z';
                if (isValid) {
                    // 構建要發送的數據
                    var postData = {
                        userID: userId,
                        userName: userName,
                        overtimeType: '加班',
                        startTime: start_DateTime_JS,
                        endTime: end_DateTime_JS,
                        count_hours: count_hours
                    };
                    // 發送 POST 請求
                    $.ajax({
                        url: 'http://internal.hochi.org.tw:8082/api/attendance/appendovetime_record', // API 端點 URL
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(postData),
                        success: function (response) {
                            alert("加班申請已成功提交！");
                            $("#dialog-form").dialog("close");
                        },
                        error: function (xhr, status, error) {
                            alert("加班申請提交失敗: " + xhr.responseText);
                        }
                    });
                }
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });

    // 設置日期選擇器
    //$("#start-date, #end-date").datepicker({
    //    dateFormat: "yy-mm-dd"
    //});

    // //設置時間選擇器
    //$("#start-time, #end-time").timepicker({
    //    timeFormat: "HH:mm"
    //});

    //檢查數值為整數或浮點數，且不可為負數
    function isValidNumber(value) {
        const numberValue = parseFloat(value);
        return !isNaN(numberValue) && numberValue >= 0 && (Number.isInteger(numberValue) || !Number.isInteger(numberValue));
    }
})

//取得cookie數值
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(/&|;/); //小心，這裡可能不同
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
};

// 創建或修改 cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "& expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "& path=/";
}

//刪除 cookie
function deleteCookie(name) {
    setCookie(name, "", -1);
}

//取得API資料
function getapidata(api_url) {
    var myAPI = api_url;
    $.getJSON(myAPI, {
        format: "json"
    })
        .done(function (data) {
            return data;
        });
    return "";
}

//將資料 上傳至資料庫
function postapidata(user_id, user_name, attendance_status) {
    let yourDate = new Date().toLocaleString('sv',1).replace(' ','T') + 'Z';
    $.ajax({
        type: "POST",
        url: "http://internal.hochi.org.tw:8082/api/attendance/appendattendance_record",
        data: JSON.stringify({
            "user_id": user_id,
            "user_name": user_name,
            "attendance_status": attendance_status,
            "create_time": yourDate
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (data) {
            alert('狀態' + attendance_status +'上傳成功!');
        },
        error: function (data) {
            console.log(data);
        }
    });
}