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
                    <h1>員工考勤數據</h1>
                    <table id="attendanceTable">
                        <thead>
                            <tr>
                                <th>姓名</th>
                                <th>應出勤天數</th>
                                <th>實際上班天數</th>
                                <th>加班天數</th>
                                <th>補修天數</th>
                                <th>病假天數</th>
                                <th>事假天數</th>
                                <th>生理假天數</th>
                                <th>其他天數</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 員工數據將動態填入這裡 -->
                        </tbody>
                    </table>
                </div>
                <div class="leave_information">
                    <span>請假資訊</span>
                    <ul id="leave_records"></ul> <!-- 用于展示请假记录 -->
                </div>
            </div>
            <div class="attendance_chart">
                <canvas id="attendanceChart"></canvas>
            </div>
        </div>
    </div>
</asp:Content>

