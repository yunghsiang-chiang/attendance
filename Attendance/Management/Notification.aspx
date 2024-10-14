<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Notification.aspx.cs" Inherits="Attendance.Management.Notification" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../Content/Management/Notification.css" rel="stylesheet" />
    <!-- CKEditor 5 的載入 -->
    <script src="https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js"></script>
    <script src="../Scripts/Management/Notification.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

    <div class="container notification_area">
        <div class="row">
            <!-- 公告編輯區 -->
            <div class="col-lg-6 col-md-12 create_message_box mb-4">
                <h3>新增公告</h3>
                <!-- 公告表單 -->
                <div id="announcementFormPanel">
                    <label for="title">標題：</label>
                    <input type="text" id="title" name="title" class="form-control" required placeholder="輸入公告標題">

                    <label for="content">內容：</label>
                    <!-- CKEditor 用於公告內容編輯 -->
                    <textarea id="content" name="content" rows="5" required placeholder="輸入公告內容"></textarea>

                    <!-- 儲存公告按鈕 -->
                    <button type="button" id="saveButton" class="btn btn-primary mt-3">儲存公告</button>
                </div>
            </div>

            <!-- 公告清單區 -->
            <div class="col-lg-6 col-md-12 notification_list">
                <h3>通知清單</h3>
                <ul id="notificationList" class="list-group"></ul>
                <div id="pagination" class="mt-3"></div>
            </div>
        </div>
    </div>
</asp:Content>
