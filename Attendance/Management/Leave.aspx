<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Leave.aspx.cs" Inherits="Attendance.Management.Leave" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>
    <script src="../Scripts/Management/Leave.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../Content/Management/Leave.css" rel="stylesheet" />
    
    <div class="main_leave_area">
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
                <canvas id="attendanceChart" ></canvas>
            </div>
        </div>
    </div>
    
</asp:Content>
