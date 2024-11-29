<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="attendance_rwd.aspx.cs" Inherits="Attendance.attendance.attendance_rwd" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <script src="../Scripts/attendance/attendance_rwd.js"></script>
    <!-- Timepicker JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script>
    <script async defer src="https://apis.google.com/js/api.js"></script>
    <!-- jQuery UI CSS -->
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/smoothness/jquery-ui.css">
    <!-- Timepicker CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.css">

    <link href="../Content/attendance/attendance_rwd.css" rel="stylesheet" />
    <div class="container" id="today_status">
        <div class="container col-sm-10" id="personal_pucture">
            <div class="inner-container image-container">
                <img src="http://internal.hochi.org.tw:8083/images/男性.png" alt="Profile Picture">
            </div>
            <!-- 新增公告清單於此 -->
            <div class="announcement-list">
                <h3>公告清單</h3>
                <ul id="announcementList" class="list-group"></ul>
            </div>

        </div>
        <div class="container col-sm-10" id="personal_infor">
            <h2>姓名:模範生</h2>
            <p>區屬:無</p>
            <p>目前打卡狀態:無</p>
            <div class="container" id="Attendance_status_switch">
                <div class="container" id="inside">
                    <div class="container" id="attended_inside_meetings">
                        <div>
                            <input type="checkbox" id="cb_morning_up_in_hochi" name="cb_morning_up_in_hochi" />
                            <label for="cb_morning_up_in_hochi">晨光上</label>
                        </div>
                        <div>
                            <input type="checkbox" id="cb_morning_down_in_hochi" name="cb_morning_down_in_hochi" />
                            <label for="cb_morning_down_in_hochi">晨光下</label>
                        </div>
                        <div>
                            <input type="checkbox" id="cb_morning_meetnig_in_hochi" name="cb_morning_meetnig_in_hochi" />
                            <label for="cb_morning_meetnig_in_hochi">晨會</label>
                        </div>
                    </div>
                    <div class="row align-items-start">
                        <input type="button" id="bt_start" class="btn btn-primary" value="到班" />
                    </div>
                    <div class="row align-items-start">
                        <input type="button" id="bt_end" class="btn btn-secondary" value="下班" />
                    </div>
                    <div class="row align-items-start">
                        <input type="button" id="bt_going_out_on_business" class="btn btn-warning" value="外出公務" />
                    </div>
                    <div class="row align-items-start">
                        <input type="button" id="bt_come_back" class="btn btn-info" value="回崗" />
                    </div>
                    <div class="row align-items-start">
                        <input type="button" id="bt_dayoff" class="btn btn-warning" value="請假" />
                    </div>
                </div>
                <div class="container" id="alert">
                    <string>請先登入，謝謝!😄</string>
                </div>
            </div>
        </div>
    </div>

    <!-- 公告詳細資訊模態框 -->
    <div id="announcementModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="announcementModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="announcementModalLabel">公告詳細資訊</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <h4 id="modalTitle"></h4>
                    <p id="modalContent"></p>
                    <p><strong>公告起始：</strong><span id="modalStartTime"></span></p>
                    <p><strong>公告截止：</strong><span id="modalEndTime"></span></p>
                    <p><strong>公告者：</strong><span id="modalAuthor"></span></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">關閉</button>
                </div>
            </div>
        </div>
    </div>

    <div id="dialog-form" title="請假申請">
        <div id="leave-form">
            <fieldset>
                <p><strong>注意：</strong> 單日請假開始-結束時間超過8小時則扣除8小時對應假期時數。</p>
                <p>不足8小時其12:30~13:30為午餐時間，不會計算請假工時。</p>
                <label for="leave-type">請假類型</label>
                <select name="leave-type" id="leave-type" class="text ui-widget-content ui-corner-all">
                    <option value="">請選擇</option>
                    <option value="病假">病假</option>
                    <option value="事假">事假</option>
                    <option value="特休">特休</option>
                    <option value="補休">補休</option>
                    <option value="生理假">生理假</option>
                </select>
                <br />
                <label for="start-date">開始日期</label>
                <input type="date" name="start-date" id="start-date" class="text ui-widget-content ui-corner-all" required>

                <label for="start-time">開始時間</label>
                <input type="time" name="start-time" id="start-time" class="text ui-widget-content ui-corner-all" required>

                <label for="end-date">結束日期</label>
                <input type="date" name="end-date" id="end-date" class="text ui-widget-content ui-corner-all" required>

                <label for="end-time">結束時間</label>
                <input type="time" name="end-time" id="end-time" class="text ui-widget-content ui-corner-all" required>
            </fieldset>
        </div>
    </div>

    <div id="dialog" title="申報加班">
        <div id="overtime-form">
            <fieldset>
                <p id="message"></p>
                <div id="overtime-times">
                    <div class="overtime-entry">
                        <label for="overtime-start-0">請選擇申報加班的起始時間：</label>
                        <input type="time" id="overtime-start-0" required>
                        <label for="overtime-end-0">請選擇申報加班的結束時間：</label>
                        <input type="time" id="overtime-end-0" required>
                        <label for="overtime-remark-0">備註：</label>
                        <textarea id="overtime-remark-0" class="form-control" rows="2" placeholder="加班原因或說明"></textarea>
                    </div>
                </div>
                <input type="button" id="add-overtime" value="新增加班時段">
            </fieldset>
        </div>
    </div>

</asp:Content>
