<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Leave.aspx.cs" Inherits="Attendance.Management.Leave" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>
    <script src="../Scripts/Management/Leave.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../Content/Management/Leave.css" rel="stylesheet" />

    <!-- ✅ 如果 Master 沒有 ScriptManager，這裡要加；有的話不要重複加 -->
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true" />

    <div class="main_leave_area">
        <div class="leave_information">
            <div class="leave">
                <div class="staff_leave">
                    <div style="display:flex;gap:10px;align-items:center;margin:8px 0;">
                        <button id="btn-update-special-all" type="button" class="btn btn-sm btn-outline-danger">
                            一次更新所有人特休(依到職日)
                        </button>
                        <span id="special-update-status" style="font-weight:600;"></span>
                    </div>

                    <span>員工休假狀態表</span>
                </div>

                <div class="leave_information">
                    <span>休假缺文件資訊</span>
                </div>
            </div>

            <div class="leave_chart">
                <span>圖表顯示區</span>
                <canvas id="attendanceChart"></canvas>
            </div>
        </div>
    </div>
</asp:Content>

