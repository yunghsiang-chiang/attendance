﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Attendance.Management.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <!-- 左上角：當天日期與員工狀態總覽 -->
    <h3>當天日期: <%= DateTime.Now.ToString("yyyy/MM/dd") %></h3>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../Content/Management/Default.css" rel="stylesheet" />
    <script src="../Scripts/Management/Default.js"></script>
    <div class="homepage">
        <div class="status-overview">
            <p>員工狀態總覽：<label class="status-item" id="staff_qty"></label></p>
            <p>同修狀態總攬：<label class="status-item" id="disciples_qty"></label></p>
            <!-- 員工狀態總覽以 label 呈現 -->
            <div class="status-container">
                <div class="form-group">
                    <label class="status-item">上班打卡人數</label>
                    <label class="status-count" id="attendance_qty">0</label>
                </div>

                <div class="form-group">
                    <label class="status-item">遲到人數</label>
                    <label class="status-count" id="arrive_late_qty">0</label>
                </div>

                <div class="form-group">
                    <label class="status-item">未打卡人數</label>
                    <label class="status-count" id="no_attendance_qty">0</label>
                </div>

                <div class="form-group">
                    <label class="status-item">早退人數</label>
                    <label class="status-count" id="leave_early_qty">0</label>
                </div>

                <div class="form-group">
                    <label class="status-item">休假人數</label>
                    <label class="status-count" id="leave_qty">0</label>
                </div>
            </div>
        </div>

        <!-- 中上：系統公告清單 -->
        <div class="announcement">
            <h3>系統公告</h3>
            <ul id="announcement-list">
                <li>公告1: 系統維護通知</li>
                <li>公告2: 新功能上線</li>
                <li>公告3: 員工培訓</li>
                <li>公告4: 年終晚會</li>
            </ul>
            <input type="button" id="view-all-announcements" value="查看全部" />
        </div>

        <!-- 右上：待處理 -->
        <div class="pending-tasks">
            <h3>待處理</h3>
            <ul>
                <li>請求1: 請求審核</li>
                <li>請求2: 文件簽署</li>
                <li>請求3: 休假審批</li>
            </ul>
        </div>

        <!-- 左下：報表區域 -->
        <div class="reports">
            <h3>報表區域</h3>
            <p>這裡放置報表的圖表或數據。</p>
        </div>

        <!-- 右下：休假紀錄區域 -->
        <div class="leave-records">
            <h3>休假紀錄</h3>
            <p>這裡顯示員工的休假紀錄。</p>
        </div>
    </div>

    <!-- jQuery UI Dialog for Announcements -->
    <div id="all-announcements-dialog" title="系統公告" style="display: none;">
        <ul>
            <li>公告1: 系統維護通知</li>
            <li>公告2: 新功能上線</li>
            <li>公告3: 員工培訓</li>
            <li>公告4: 年終晚會</li>
            <li>公告5: 新的安全政策</li>
            <li>公告6: 聖誕假期安排</li>
        </ul>
    </div>
</asp:Content>
