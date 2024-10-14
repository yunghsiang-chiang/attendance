<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Attendance.aspx.cs" Inherits="Attendance.Management.Attendance" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../Content/Management/Attendance.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="../Scripts/Management/Attendance.js"></script>

    <div class="container main_attendance_area">
        <!-- 考勤日曆區域 -->
        <div class="row justify-content-center attendance_calendar mb-4">
            <div class="col-auto">
                <input type="button" class="btn btn-secondary" id="prevMonthBtn" value="上個月">
            </div>
            <div class="col-auto">
                <span id="currentMonthLabel"></span>
            </div>
            <div class="col-auto">
                <input type="button" class="btn btn-secondary" id="nextMonthBtn" value="下個月">
            </div>
        </div>

        <!-- 考勤資訊和圖表 -->
        <div class="row attendnace_information">
            <!-- 考勤數據表格 -->
            <div class="col-lg-8 mb-4">
                <div class="card staff_attendacne">
                    <div class="card-body">
                        <h1 class="card-title">員工考勤數據</h1>
                        <table class="table table-bordered table-striped" id="attendanceTable">
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
                </div>
            </div>

            <!-- 請假資訊 -->
            <div class="col-lg-4 mb-4">
                <div class="card leave_information">
                    <div class="card-body">
                        <h5>請假資訊</h5>
                        <ul class="list-group" id="leave_records">
                            <!-- 用于展示請假記錄 -->
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 圖表區域 -->
            <div class="col-lg-12 mb-4">
                <div class="card attendance_chart">
                    <div class="card-body">
                        <canvas id="attendanceChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
