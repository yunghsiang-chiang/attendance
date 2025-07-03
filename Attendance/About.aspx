<%@ Page Title="關於 AI 問答服務" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="Attendance.About" %>
<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
    <div class="container py-4">
        <h2 class="text-center mb-4">📚 AI 問答系統狀態</h2>

        <div class="mb-3">
            <h5>🔧 系統健康狀態</h5>
            <p id="healthStatus">讀取中...</p>
        </div>

        <div class="mb-3">
            <button class="btn btn-outline-primary w-100 d-md-none mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#sourceCollapse">
                📁 目前使用資料源
            </button>
            <div class="collapse d-md-block" id="sourceCollapse">
                <h5 class="d-none d-md-block">📁 目前使用資料源</h5>
                <ul class="list-group" id="sourceFiles"></ul>
            </div>
        </div>

        <div class="mb-3">
            <h5>❓ 問我一個問題</h5>
            <div class="input-group mb-2">
                <input type="text" class="form-control" id="questionInput" placeholder="請輸入您的問題..." />
                <button class="btn btn-success" id="askBtn">送出</button>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h5 class="card-title">📝 問題</h5>
                <p id="qText" class="card-text"></p>
                <h5 class="card-title">💡 回答</h5>
                <p id="aText" class="card-text"></p>
                <h5 class="card-title">📚 參考內容</h5>
                <pre id="contextText" class="bg-light p-2"></pre>
                <p class="text-end text-muted">⏱️ 花費時間：<span id="elapsed"></span> 秒</p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="Scripts/About.js"></script>
</asp:Content>