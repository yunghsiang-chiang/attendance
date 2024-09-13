<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Attendance_calendar.aspx.cs" Inherits="Attendance.attendance.Attendance_calendar" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <link href="../Content/attendance/Attendance_calendar.css" rel="stylesheet" />
    <main>
        <section>
            <script src="../Scripts/attendance/Attendance_calendar.js"></script>
            <div class="container">
                <div class="month-controls">
                    <input type="button" class="btn btn-primary" id="prevMonth" value="Previous Month" />
                    <h2 id="monthLabel" class="mx-3"></h2>
                    <input type="button" class="btn btn-primary" id="nextMonth" value="Next Month" />
                </div>

                <div class="calendar" id="calendar"></div>
            </div>
            <div id="dialog" title="出勤詳細資訊"></div>
        </section>
    </main>
</asp:Content>
