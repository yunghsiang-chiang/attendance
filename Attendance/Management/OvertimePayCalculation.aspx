<%@ Page Title="加班費計算輔助工具" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="OvertimePayCalculation.aspx.cs" Inherits="Attendance.Management.OvertimePayCalculation" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="container mt-4">
        <h1 class="text-center">加班費計算輔助工具</h1>
        <div class="mb-4">
            <label for="userSelect" class="form-label">選擇用戶</label>
            <select id="userSelect" class="form-control">
                <option value="">請選擇用戶</option>
            </select>
        </div>
        <div class="row mb-4">
            <div class="col">
                <label for="year" class="form-label">年份</label>
                <input type="number" id="year" class="form-control" placeholder="輸入年份，如 2024">
            </div>
            <div class="col">
                <label for="month" class="form-label">月份</label>
                <input type="number" id="month" class="form-control" placeholder="輸入月份，如 11">
            </div>
        </div>
        <button type="button" id="calculateButton" class="btn btn-primary">計算加班費</button>
        <div id="results" class="mt-5">
            <h3>加班費計算結果</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>加班倍率</th>
                        <th>加班小時數</th>
                    </tr>
                </thead>
                <tbody id="resultsTable">
                </tbody>
            </table>
        </div>
        <div id="overtimeDetails" class="mt-5">
            <h3>加班明細</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>開始時間</th>
                        <th>結束時間</th>
                        <th>加班小時數</th>
                        <th>提交時間</th>
                        <th>審批者</th>
                    </tr>
                </thead>
                <tbody id="detailsTable">
                </tbody>
            </table>
        </div>
    </div>
    <script src="../Scripts/Management/OvertimePayCalculation.js"></script>
</asp:Content>
