<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Reports.aspx.cs" Inherits="Attendance.Management.Reports" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="../Scripts/Management/Reports.js"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="container mt-4">
        <h2 class="mb-4">出勤報表</h2>

        <!-- Date selection row -->
        <div class="row mb-3">
            <div class="col-md-4">
                <label for="startDate" class="form-label">起始日期</label>
                <input type="date" id="startDate" class="form-control" required>
            </div>
            <div class="col-md-4">
                <label for="endDate" class="form-label">結束日期</label>
                <input type="date" id="endDate" class="form-control" required>
            </div>
            <div class="col-md-4 d-flex align-items-end">
                <button type="button" id="generateReport" class="btn btn-primary w-100">產生報表</button>
            </div>
        </div>

        <!-- Report table -->
        <div id="reportContainer" class="table-responsive">
            <table id="reportTable" class="table table-bordered table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>員工 ID</th>
                        <th>姓名</th>
                        <th>出勤(day</th>
                        <th>晨會(day</th>
                        <th>晨光上(day</th>
                        <th>晨光下(day</th>
                        <th>病假(hr</th>
                        <th>事假(hr</th>
                        <th>特休(hr</th>
                        <th>補休(hr</th>
                        <th>加班(hr</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Data will be dynamically inserted here -->
                </tbody>
            </table>
        </div>
    </div>
</asp:Content>
