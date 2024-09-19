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

    // 發送 API 請求
    function postapidata(user_id, user_name, attendance_status) {
        const localDate = new Date();
        const localISOString = toLocalISOString(localDate);
        $.ajax({
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
            },
            success: function (data) {
                alert('狀態' + attendance_status + '上傳成功!');
            },
            error: function (data) {
                console.log(data);
            }
        });
    }

    // 處理按鈕點擊事件
    function handleButtonClick(selector, status) {
        $(selector).click(function () {
            setCookie('last_status', status, 1);
            setCookie('attendance_state', status, 1);
            setCookie('start', new Date().toLocaleString('sv'), 1);
            $('#personal_infor p:nth-child(3)').text('目前打卡狀態:' + status);
            postapidata(getCookie("person_id"), getCookie("person_name"), status);
        });
    }

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

    // 請假對話框初始化
    $("#dialog-form").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "確認": function () {
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
                let hoursDifference = timeDifference / (1000 * 60 * 60);

                // 超過8小時則鎖定8小時
                if (hoursDifference > 8) {
                    hoursDifference = 8;
                }

                // 檢查請假類型是否選擇
                if (!leaveType) {
                    alert("請選擇請假類型");
                    isValid = false;
                }

                // 檢查日期和時間格式
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 格式
                const timeRegex = /^\d{2}:\d{2}$/; // HH:mm 格式

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
                    var postData = {
                        userId: userId,
                        userName: userName,
                        leaveType: leaveType,
                        startTime: start_Date + 'T' + start_Time + ':00.000Z',
                        endTime: end_Date + 'T' + end_Time + ':00.000Z',
                        count_hours: hoursDifference
                    };

                    $.ajax({
                        url: 'http://internal.hochi.org.tw:8082/api/attendance/appendleave_record',
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

    // 加班對話框初始化
    $('#dialog').dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "確認": function () {
                const userId = getCookie("person_id");
                const userName = getCookie("person_name");
                const evening6 = new Date();
                evening6.setHours(18, 0, 0, 0);
                let start_DateTime = new Date();
                if (getCookie('overtimein') !== '') {
                    const dateString = getCookie('overtimein');
                    const [datePart, timePart] = dateString.split(' ');
                    const [year, month, day] = datePart.split('-').map(Number);
                    const [hours, minutes, seconds] = timePart.split(':').map(Number);
                    start_DateTime = new Date(year, month - 1, day, hours, minutes, seconds);
                }
                const diff6 = (Date.now() - evening6) / (1000 * 60 * 60);
                const hours = parseFloat($('#overtime-hours').val());
                if (hours < 0.5) {
                    alert("請選擇超過 0.5 小時的加班時間!");
                    return;
                }

                postapidata(userId, userName, '加班');
                $(this).dialog("close");
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });

});
