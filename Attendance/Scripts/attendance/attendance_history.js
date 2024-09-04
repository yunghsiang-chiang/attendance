//doucment ready event
$(document).ready(function () {
    //將同修資訊並丟到下拉選單
    get_person_information_to_dropdownlist();

    //搜尋按鈕事件
    $("#search").click(function () {
        var isReady = false;
        var dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 格式
        if ($('#name-select option:selected').val() != "" && dateRegex.test($('#start-date').val()) && dateRegex.test($('#end-date').val())) {
            isReady = true;
        }
        if (isReady) {

            search_attendance_record($('#name-select option:selected').val(), $('#start-date').val(), $('#end-date').val());
        }
    });


})

//將同修資訊並丟到下拉選單
function get_person_information_to_dropdownlist() {
    let api_url = "http://internal.hochi.org.tw:8082/api/hochi_learners/get_person_IdName";
    var myAPI = api_url;
    $.getJSON(myAPI, {
        format: "json"
    })
        .done(function (data) {
            let unit = '';
            for (var i = 0; i < data.length; i++) {
                unit += '<option value="' + data[i].person_id + '">' + data[i].person_name + '</option>';
            }
            $('#name-select').append(unit);
        });
}

function search_attendance_record(userid, startdate, enddate) {
    $('#records-tbody').empty();
    $('#statistics-tbody').empty();
    let api_url = "http://internal.hochi.org.tw:8082/api/attendance/get_attendance_record?userid=" + userid + "&startdate=" + startdate + "&enddate=" + enddate;
    var myAPI = api_url;
    $.getJSON(myAPI, {
        format: "json"
    })
        .done(function (data) {
            if (data.length > 0) {
                let attendancedaysarray = new Set(); //出勤日
                var overtimehours = 0; //加班小時
                var leavehours = 0; //事假小時
                var special_vacation_hours = 0; //特休小時
                var compensatory_leave_hours = 0; //補休小時
                try {
                    let unit = '';
                    let username = data[0].user_name; //姓名
                    for (var i = 0; i < data.length; i++) {
                        unit += '<tr><td>' + data[i].user_name + '</td><td>' + data[i].attendance_status + '</td><td>' + data[i].create_time.replace('T', ' ') + '</td></tr>';
                        //如果狀態=到班 add value to set()
                        if (data[i].attendance_status == '到班') {
                            attendancedaysarray.add(data[i].create_time.split('T')[0]);
                        }
                    }
                    $('#records-tbody').append(unit);
                    let api_leave_url = "http://internal.hochi.org.tw:8082/api/attendance/get_leave_record?userid=" + userid + "&startdate=" + startdate + "&enddate=" + enddate;
                    var myAPIleave = api_leave_url;
                    $.getJSON(myAPIleave, {
                        format: "json"
                    })
                        .done(function (data) {
                            if (data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].leaveType == "加班") {
                                        overtimehours += data[i].count_hours;
                                    } else if (data[i].leaveType == "事假") {
                                        leavehours += data[i].count_hours;
                                    } else if (data[i].leaveType == "特休") {
                                        special_vacation_hours += data[i].count_hours;
                                    } else if (data[i].leaveType == "補休") {
                                        compensatory_leave_hours += data[i].count_hours;
                                    }
                                }
                                let recordsbody = '<tr><td>' + username + '</td><td>' + attendancedaysarray.size + '</td><td>' + overtimehours + '</td><td>' + leavehours + '</td><td>' + special_vacation_hours + '</td><td>' + compensatory_leave_hours + '</td></tr>';
                                $('#statistics-tbody').append(recordsbody);
                            } else {
                                let recordsbody = '<tr><td>' + username + '</td><td>' + attendancedaysarray.size + '</td><td>' + overtimehours + '</td><td>' + leavehours + '</td><td>' + special_vacation_hours + '</td><td>' + compensatory_leave_hours + '</td></tr>';
                                $('#statistics-tbody').append(recordsbody);
                            }
                        });
                    
                } catch (error) {
                    console.log(error);
                }
            }

        });
}