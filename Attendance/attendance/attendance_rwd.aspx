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

    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
        }

        #dialog-form {
            display: none;
        }

        .ui-widget-content {
            font-size: 16px;
        }

        #today_status, #attended_meetings {
            display: flex; /* 使用 Flexbox 來進行布局 */
            justify-content: space-between; /* 讓兩個內部 container 水平並排，並在空間中分配 */
            padding: 20px; /* 外層 container 的內邊距 */
            background-color: #f0f0f0; /* 背景顏色 */
            flex-wrap: wrap; /* 允許內容換行 */
        }

            #today_status div {
                flex: 1; /* 讓內部 container 在外層 container 中均分空間 */
                margin: 0 10px; /* 內部 container 之間的間距 */
                padding: 20px; /* 內部 container 的內邊距 */
                background-color: #ffffff; /* 內部 container 的背景顏色 */
                /*border: 1px solid #ccc;*/ /* 內部 container 的邊框 */
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 內部 container 的陰影效果 */
            }

        /* 圖片容器樣式 */
        .image-container img {
            width: 100%; /* 讓圖片的寬度填滿容器 */
            height: auto; /* 保持圖片的原始高寬比 */
            border-radius: 50%; /* 使圖片圓形（可根據需要調整） */
            display: block; /* 去掉圖片下方的空白 */
        }

        /* 文字容器樣式 */
        #personal_infor {
            display: flex;
            flex-direction: column;
            justify-content: center; /* 垂直居中內容 */
        }


        /* 媒體查詢：當屏幕寬度小於 768px 時（例如手機） */
        @media (max-width: 768px) {
            #today_status, #attended_meetings {
                flex-direction: column; /* 改為垂直排列 */
                align-items: center; /* 讓內部 container 在垂直方向上居中 */
            }

                #today_status div {
                    margin: 10px 0; /* 修改內部 container 之間的間距，讓它們在垂直方向上間隔 */
                }

            .image-container img {
                width: 150px; /* 設置圖片的固定寬度，以適應小屏幕 */
                height: 150px; /* 設置圖片的固定高度 */
                border-radius: 50%; /* 圓形圖片 */
            }
        }
    </style>
    <div class="container" id="today_status">
        <div class="container col-sm-10" id="personal_pucture">
            <div class="inner-container image-container">
                <img src="http://10.10.3.75:8083/images/男性.png" alt="Profile Picture">
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
                <div class="container" id="outside">
                    <div class="container" id="attended_outside_meetings">
                        <div>
                            <input type="checkbox" id="cb_morning_up_out_hochi" name="cb_morning_up_out_hochi" />
                            <label for="cb_morning_up_out_hochi">晨光上</label>
                        </div>
                        <div>
                            <input type="checkbox" id="cb_morning_down_out_hochi" name="cb_morning_down_out_hochi" />
                            <label for="cb_morning_down_out_hochi">晨光下</label>
                        </div>
                        <div>
                            <input type="checkbox" id="cb_morning_meeting_out_hochi" name="cb_morning_meeting_out_hochi" />
                            <label for="cb_morning_meeting_out_hochi">晨會</label>
                        </div>
                    </div>
                    <div class="row align-items-start">
                        <input type="button" id="bt_outside_business" class="btn btn-primary" value="外出公務" />
                    </div>
                    <div class="row align-items-start">
                        <input type="button" id="bt_sick_leave" class="btn btn-danger" value="請病假" />
                    </div>
                    <div class="row align-items-start">
                        <input type="button" id="bt_menstrual_leave" class="btn btn-warning" value="請生理假" />
                    </div>
                    <div class="row align-items-start">
                        <input type="button" id="bt_personal_leave" class="btn btn-light" value="請事假" />
                    </div>
                    <div class="row align-items-start">
                        <input type="button" id="bt_compensatory_leave" class="btn btn-success" value="補休" />
                    </div>
                    <div class="row align-items-start">
                        <input type="button" id="bt_specaial_leave" class="btn btn-success" value="特休" />
                    </div>
                </div>
                <div class="container" id="alert">
                    <string>請先登入，謝謝!😄</string>
                </div>


            </div>
        </div>
    </div>

    <div id="dialog-form" title="請假申請">
        <form id="leave-form">
            <fieldset>
                <mark>
                    單日請假開始-結束時間超過8小時則扣除8小時對應假期時數<br />
                    不足8小時其12:30~13:30為午餐時間，不會計算請假工時<br />
                </mark>
                <label for="leave-type">請假類型</label>
                <select name="leave-type" id="leave-type" class="text ui-widget-content ui-corner-all">
                    <option value="">請選擇</option>
                    <option value="病假">病假</option>
                    <option value="事假">事假</option>
                    <option value="特休">特休</option>
                    <option value="補休">補休</option>
                </select>
                <br />
                <label for="start-date">開始日期</label>
                <input type="text" name="start-date" id="start-date" class="text ui-widget-content ui-corner-all" required>

                <label for="start-time">開始時間</label>
                <input type="text" name="start-time" id="start-time" class="text ui-widget-content ui-corner-all" placeholder="HH:mm" autocomplete="off" required>

                <label for="end-date">結束日期</label>
                <input type="text" name="end-date" id="end-date" class="text ui-widget-content ui-corner-all" required>

                <label for="end-time">結束時間</label>
                <input type="text" name="end-time" id="end-time" class="text ui-widget-content ui-corner-all" placeholder="HH:mm" autocomplete="off" required>

                <%--<button type="button" id="submit-button">確認</button>--%>
            </fieldset>
        </form>
    </div>

</asp:Content>
