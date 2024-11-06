<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Management.aspx.cs" Inherits="Attendance.Management.Management" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="../Scripts/Management/Management.js"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="container mt-4">
        <h2>HR資料補登管理</h2>

        <!-- 員工選擇下拉清單 -->
        <div class="mb-3">
            <label for="employeeSelect" class="form-label">選擇員工</label>
            <select class="form-select" id="employeeSelect"></select>
        </div>

        <!-- 查詢區域 -->
        <div class="row mb-4">
            <div class="col-md-4">
                <label for="startDate" class="form-label">開始日期</label>
                <input type="date" class="form-control" id="startDate">
            </div>
            <div class="col-md-4">
                <label for="endDate" class="form-label">結束日期</label>
                <input type="date" class="form-control" id="endDate">
            </div>
            <div class="col-md-4 d-flex align-items-end">
                <button class="btn btn-primary w-100" id="queryBtn">查詢出勤記錄</button>
            </div>
        </div>

        <!-- 顯示查詢結果 -->
        <div class="mb-3">
            <h4>查詢結果</h4>
            <div id="attendanceRecords"></div>
        </div>

        <!-- 新增資料表單 -->
        <h4>新增出勤/請假/加班記錄</h4>
        <div class="row mb-3">
            <div class="col-md-6">
                <label for="recordType" class="form-label">記錄類型</label>
                <select class="form-select" id="recordType">
                    <option value="attendance">出勤</option>
                    <option value="leave">請假</option>
                    <option value="overtime">加班</option>
                </select>
            </div>
            <div class="col-md-6">
                <label for="attendanceStatus" class="form-label">出勤狀態</label>
                <select class="form-select" id="attendanceStatus">
                    <option value="到班">到班</option>
                    <option value="外出公務">外出公務</option>
                    <option value="回崗">回崗</option>
                    <option value="下班">下班</option>
                </select>
            </div>
            <div class="col-md-6 mt-3" id="leaveTypeGroup">
                <label for="leaveType" class="form-label">請假類型</label>
                <select class="form-select" id="leaveType">
                    <option value="病假">病假</option>
                    <option value="事假">事假</option>
                    <option value="特休">特休</option>
                    <option value="補休">補休</option>
                    <option value="生理假">生理假</option>
                </select>
            </div>
            <div class="col-md-6 mt-3" id="overtimeTypeGroup">
                <label for="overtimeType" class="form-label">加班類型</label>
                <select class="form-select" id="overtimeType">
                    <option value="加班">加班</option>
                </select>
            </div>
            <div class="col-md-6 mt-3">
                <label for="startTime" class="form-label">開始時間</label>
                <input type="datetime-local" class="form-control" id="startTime">
            </div>
            <div class="col-md-6 mt-3">
                <label for="endTime" class="form-label">結束時間</label>
                <input type="datetime-local" class="form-control" id="endTime">
            </div>
            <div class="col-md-12 mt-3">
                <button class="btn btn-success w-100" id="addRecordBtn">新增記錄</button>
            </div>
        </div>
    </div>
</asp:Content>
