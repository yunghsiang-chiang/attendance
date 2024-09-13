<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Attendance.aspx.cs" Inherits="Attendance.Management.Attendance" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    head 位置
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../Content/Management/Attendance.css" rel="stylesheet" />
    
    <script src="../Scripts/Management/Attendance.js"></script>
    <div class="main_attendance_area">
        <div class="attendance_calendar">
            <input type="button" id="prevMonthBtn" value="上個月">
            <span id="currentMonthLabel"></span>
            <input type="button" id="nextMonthBtn" value="下個月">
        </div>
        <div class="attendnace_information">
            <div class="attendance">
                <div class="staff_attendacne">
                    <span>員工出勤狀態表</span>
                </div>
                <div class="leave_information">
                    <span>請假資訊</span>
                </div>
            </div>
            <div class="attendance_chart">
                <canvas id="attendanceChart"></canvas>
            </div>
        </div>
    </div>
</asp:Content>

