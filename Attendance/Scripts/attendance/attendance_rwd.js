//doucment ready event
$(document).ready(function () {
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
    $('#bt_start').click(function () {
        setCookie('last_status', '到班', 1);
        setCookie('attendance_state', '到班', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:到班');
        postapidata(getCookie("person_id"), getCookie("person_name"),"到班");
    });
    //下班 button
    $('#bt_end').click(function () {
        setCookie('last_status', '下班', 1);
        setCookie('attendance_state', '下班', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:下班');
        postapidata(getCookie("person_id"), getCookie("person_name"), "下班");
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
    //請假
    $('#bt_dayoff').click(function () {
        setCookie('last_status', '請假', 1);
        setCookie('attendance_state', '請假', 1);
        setCookie('start', Date().toLocaleString('sv'), 1);
        $('#personal_infor p:nth-child(3)').text('目前打卡狀態:請假');
        postapidata(getCookie("person_id"), getCookie("person_name"), "請假");
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
})

//取得cookie數值
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split('&'); //小心，這裡可能不同
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

function postapidata(user_id, user_name, attendance_status) {
    let yourDate = new Date().toLocaleString('sv',1).replace(' ','T') + 'Z';
    console.log(yourDate);
    $.ajax({
        type: "POST",
        url: "http://10.10.3.75:8082/api/attendance/appendattendance_record",
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
            alert('上傳成功!');
        },
        error: function (data) {
            console.log(data);
        }
    });
}