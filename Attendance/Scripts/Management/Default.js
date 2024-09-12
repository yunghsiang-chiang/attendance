$(function () {
    $("#view-all-announcements").click(function () {
        $("#all-announcements-dialog").dialog({
            modal: true,
            width: 400
        });
    });
});
//DOM 載入完畢 再呼叫javascript，避免元件不存在 
$(document).ready(function () {
    let attendance_qty = new Number();
    let staff_qty = new Number();;
    //確認出勤狀態，將今日報到情況透過API確認數據
    get_today_attendance_records();
    //取得員工人數
    get_staff_qty();
    //取得今日出勤數據
    function get_today_attendance_records() {
        var api_url = "http://internal.hochi.org.tw:8082/api/attendance/get_today_attendance_record/";
        var myAPI = api_url;
        $.getJSON(myAPI, {
            format: "json"
        }).done(function (data) {
            if (data.length > 0) {
                let attendance_name_set = new Set(); //不重複，承接人名
                for (var i = 0; i < data.length; i++) {
                    if (!attendance_name_set.has(data[i].user_name) && data[i].attendance_status == '到班') {
                        attendance_name_set.add(data[i].user_name);
                    }
                }
                attendance_qty = attendance_name_set.size;
                $('#attendance_qty').text(attendance_qty);
            };
        });
    };
    //取得人員屬性為staff 人數
    function get_staff_qty() {
        var api_url = "http://internal.hochi.org.tw:8082/api/hochi_learners/get_staff_qty";
        var myAPI = api_url;
        $.getJSON(myAPI, {
            format: "json"
        }).done(function (data) {
            staff_qty = data - attendance_qty;
            $('#no_attendance_qty').text(staff_qty);
            $('#staff_qty').text(data+'人');
        });
    }
})