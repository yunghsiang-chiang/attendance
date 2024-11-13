<%@ Page Title="公告管理" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Notification.aspx.cs" Inherits="Attendance.Management.Notification" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js"></script>
    <script src="../Scripts/Management/Notification.js"></script>
    
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="container notification_area">
        <div class="row">
            <section class="col-lg-6 col-md-12 create_message_box mb-4">
                <h3>新增公告</h3>
                <div id="announcementFormPanel">
                    <label for="title">標題：</label>
                    <input type="text" id="title" name="title" class="form-control" required placeholder="輸入公告標題">

                    <label for="content">內容：</label>
                    <textarea id="content" name="content" rows="5" required placeholder="輸入公告內容"></textarea>

                    <button type="button" id="saveButton" class="btn btn-primary mt-3">儲存公告</button>
                </div>
            </section>

            <section class="col-lg-6 col-md-12 notification_list">
                <h3>通知清單</h3>
                <ul id="notificationList" class="list-group"></ul>
                <div id="pagination" class="mt-3"></div>
            </section>
        </div>
    </div>
    <link href="../Content/Management/Notification.css" rel="stylesheet" />
</asp:Content>
