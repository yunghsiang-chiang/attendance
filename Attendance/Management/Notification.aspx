<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Notification.aspx.cs" Inherits="Attendance.Management.Notification" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    head 位置
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../Content/Management/Notification.css" rel="stylesheet" />
    <script src="../Scripts/Management/Notification.js"></script>
    <div class="notification_area">
        <div class="create_message_box">
            <span>產生通知訊息編輯區</span>
        </div>
        <div class="notification_list">
            <h3>通知清單</h3>
            <span>如果通知太多，分頁的方式呈現</span>
        </div>
    </div>
</asp:Content>