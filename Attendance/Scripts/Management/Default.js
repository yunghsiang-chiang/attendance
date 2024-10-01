$(function () {
    $("#view-all-announcements").click(function () {
        $("#all-announcements-dialog").dialog({
            modal: true,
            width: 400
        });
    });
});
// DOM 載入完畢後，再呼叫 JavaScript，避免元件不存在
$(document).ready(async function () {
    // 出勤人數
    let attendance_qty = new Number();
    // 員工人數
    let staff_qty = new Number();
    // 同修人數
    let disciples_qty = new Number();

    // 確認出勤狀態，將今日報到情況透過 API 確認數據
    await get_today_attendance_records();
    // 取得員工人數
    await get_staff_qty();
    // 取得同修人數
    await get_disciples_qty();

    // 取得今日出勤數據
    // 將 get_today_attendance_records() 和 get_staff_qty() 包裝在 Promise 裡，並使用 resolve() 和 reject() 來處理成功和失敗的情況
    async function get_today_attendance_records() {
        var api_url = "http://internal.hochi.org.tw:8082/api/attendance/get_today_attendance_record/";
        var myAPI = api_url;

        return new Promise((resolve, reject) => {
            $.getJSON(myAPI, {
                format: "json"
            }).done(function (data) {
                if (data.length > 0) {
                    let attendance_name_set = new Set(); // 不重複，承接人名
                    for (var i = 0; i < data.length; i++) {
                        if (!attendance_name_set.has(data[i].user_name) && (data[i].attendance_status == '到班' || data[i].attendance_status == '外出公務')) {
                            attendance_name_set.add(data[i].user_name);
                        }
                    }
                    attendance_qty = attendance_name_set.size;
                    $('#attendance_qty').text(attendance_qty);
                }
                resolve(); // 在 API 調用成功並處理完成後，resolve 這個 promise
            }).fail(function (error) {
                reject(error); // 若 API 調用失敗，reject 這個 promise
            });
        });
    }

    // 取得人員屬性為 staff 人數
    async function get_staff_qty() {
        var api_url = "http://internal.hochi.org.tw:8082/api/hochi_learners/get_staff_qty";
        var myAPI = api_url;

        return new Promise((resolve, reject) => {
            $.getJSON(myAPI, {
                format: "json"
            }).done(function (data) {
                staff_qty = data; // 員工人數
                $('#staff_qty').text(data + '人');
                resolve(); // 在 API 調用成功後 resolve 這個 promise
            }).fail(function (error) {
                reject(error); // 若 API 調用失敗，reject 這個 promise
            });
        });
    }

    // 取得同修人數
    async function get_disciples_qty() {
        var api_url = "http://internal.hochi.org.tw:8082/api/hochi_learners/get_disciple_qty";
        var myAPI = api_url;

        return new Promise((resolve, reject) => {
            $.getJSON(myAPI, {
                format: "json"
            }).done(function (data) {
                disciples_qty = data; // 獲取同修人數
                $('#disciples_qty').text(data + '人'); // 更新同修人數顯示
                // 計算未打卡人數，考量同修人數
                let no_attendance_qty = staff_qty + disciples_qty - attendance_qty ;
                $('#no_attendance_qty').text(no_attendance_qty); // 更新未打卡人數顯示
                resolve(); // 在 API 調用成功後 resolve 這個 promise
            }).fail(function (error) {
                reject(error); // 若 API 調用失敗，reject 這個 promise
            });
        });
    }
});