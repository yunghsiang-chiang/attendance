<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Leave.aspx.cs" Inherits="Attendance.Management.Leave" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    head 位置
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../Content/Management/Leave.css" rel="stylesheet" />
    <script src="../Scripts/Management/Leave.js"></script>
    <div class="main_leave_area">
        <div class="leave_calendar">
            <input type="button" id="prevMonthBtn" value="上個月">
            <span id="currentMonthLabel"></span>
            <input type="button" id="nextMonthBtn" value="下個月">
        </div>
        <div class="leave_information">
            <div class="leave">
                <div class="staff_leave">
                    <span>員工休假狀態表</span>
                </div>
                <div class="leave_information">
                    <span>休假缺文件資訊</span>
                </div>
            </div>
            <div class="leave_chart">
                <span>圖表顯示區</span>
            </div>
        </div>
    </div>
</asp:Content>
