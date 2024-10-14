<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Attendance.Management.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <!-- 左上角：當天日期與員工狀態總覽 -->
    <h3>當天日期: <%= DateTime.Now.ToString("yyyy/MM/dd") %></h3>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../Content/Management/Default.css" rel="stylesheet" />
    <script src="../Scripts/Management/Default.js"></script>
    
<%--    <!-- 引入 Bootstrap -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>--%>

    <!-- 使用 Bootstrap 的容器和網格系統 -->
    <div class="container homepage">
        <div class="row">
            <!-- 員工狀態總覽 -->
            <div class="col-md-6 status-overview mb-4">
                <h3>員工狀態總覽</h3>
                <div class="row">
                    <div class="col-sm-6 form-group">
                        員工：<label class="status-item" id="staff_qty"></label>
                    </div>
                    <div class="col-sm-6 form-group">
                        同修：<label class="status-item" id="disciples_qty"></label>
                    </div>
                    <div class="col-sm-6 form-group">
                        機要：<label class="status-item" id="secretary_qty"></label>
                    </div>
                    <div class="col-sm-6 form-group">
                        IT：<label class="status-item" id="IT_qty"></label>
                    </div>
                </div>

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

            <!-- 系統公告清單 -->
            <div class="col-md-6 announcement mb-4">
                <h3>系統公告</h3>
                <ul class="list-group">
                    <li class="list-group-item">公告1: 系統維護通知</li>
                    <li class="list-group-item">公告2: 新功能上線</li>
                    <li class="list-group-item">公告3: 員工培訓</li>
                    <li class="list-group-item">公告4: 年終晚會</li>
                </ul>
                <button class="btn btn-primary mt-2" id="view-all-announcements">查看全部</button>
            </div>
        </div>

        <div class="row">
            <!-- 待處理 -->
            <div class="col-md-6 pending-tasks mb-4">
                <h3>待處理</h3>
                <ul class="list-group">
                    <li class="list-group-item" id="request-review">請求1: 請求審核</li>
                    <li class="list-group-item">請求2: 文件簽署</li>
                    <li class="list-group-item" id="leave-approval">請求3: 休假審批</li>
                </ul>
            </div>

            <!-- 報表區域 -->
            <div class="col-md-6 reports mb-4">
                <h3>報表區域</h3>
                <p>這裡放置報表的圖表或數據。</p>
            </div>
        </div>

        <div class="row">
            <!-- 休假紀錄 -->
            <div class="col-md-12 leave-records mb-4">
                <h3>休假紀錄</h3>
                <table class="table leave-table">
                    <thead>
                        <tr>
                            <th>員工姓名</th>
                            <th>休假類型</th>
                            <th>開始日期</th>
                            <th>結束日期</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- 動態填充 -->
                    </tbody>
                </table>
            </div>
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
