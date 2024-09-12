<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Apply.aspx.cs" Inherits="Attendance.Management.Apply" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    head 位置
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../Content/Management/Apply.css" rel="stylesheet" />
    <script src="../Scripts/Management/Apply.js"></script>
    <div class="mainapply">
        <div class="attendance_apply">
            <div class="overtime_apply">
                <span>申請加班</span>
            </div>
            <div class="after_apply">
                <sapn>事後申請</sapn>
            </div>
            <div class="before_apply">
                <span>事先申請</span>
            </div>
        </div>
        <div class="other_apply">
            <span>預留，其餘申請區域</span>
        </div>
    </div>
</asp:Content>
