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

                <!-- 新增累積數據區域 -->
                <div class="summary-area mt-4">
                    <h3>當月累積數據</h3>
                    <div class="summary-data">
                        <p><strong>晨光上：</strong><span id="morningLightUpTotal">0</span></p>
                        <p><strong>晨光下：</strong><span id="morningLightDownTotal">0</span></p>
                        <p><strong>晨會：</strong><span id="morningMeetingTotal">0</span></p>
                    </div>
                </div>

            </div>
            <div id="dialog" title="出勤詳細資訊"></div>
        </section>
    </main>
</asp:Content>
