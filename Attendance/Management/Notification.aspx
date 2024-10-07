<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Notification.aspx.cs" Inherits="Attendance.Management.Notification" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../Content/Management/Notification.css" rel="stylesheet" />
    <!-- CKEditor 5 的載入 -->
    <script src="https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js"></script>
    <script src="../Scripts/Management/Notification.js"></script>
    <div class="notification_area">
        <!-- 公告編輯區 -->
        <div class="create_message_box">
            <h3>新增公告</h3>

            <!-- 公告表單 -->
            <div id="announcementFormPanel">
                <label for="title">標題：</label>
                <input type="text" id="title" name="title" class="form-control" required placeholder="輸入公告標題">

                <label for="content">內容：</label>
                <!-- CKEditor 用於公告內容編輯 -->
                <textarea id="content" name="content" rows="5" required placeholder="輸入公告內容"></textarea>

                <!-- 儲存公告按鈕 -->
                <button type="button" id="saveButton" class="btn btn-primary">儲存公告</button>
            </div>
        </div>

        <!-- 公告清單區 -->
        <div class="notification_list">
            <h3>通知清單</h3>
            <ul id="notificationList"></ul>
            <div id="pagination"></div>
        </div>
    </div>
</asp:Content>
