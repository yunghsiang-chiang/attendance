﻿<%@ Page Title="關於 AI 問答服務" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="Attendance.About" %>
<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container mt-4">
        <h2>AI 問答服務狀態</h2>

        <!-- 健康狀態 -->
        <div id="healthStatus" class="alert alert-info"></div>

        <!-- 資料來源 -->
        <h4>目前使用資料源</h4>
        <p id="sourceInfo" class="text-muted mt-2"></p>
        <ul id="sourceFiles" class="list-group mb-4"></ul>

        <!-- 提問區塊 -->
        <h4>輸入您的問題</h4>
        <div class="input-group mb-3">
            <input type="text" id="questionInput" class="form-control" placeholder="請輸入您的問題...">
            <button type="button" id="askBtn" class="btn btn-primary">送出問題</button>
        </div>

        <div class="card">
            <div class="card-header">AI 回答</div>
            <div class="card-body">
                <p><strong>問題：</strong> <span id="qText"></span></p>
                <p><strong>回答：</strong> <span id="aText"></span></p>
                <p><strong>原始內容：</strong> <pre id="contextText" style="white-space: pre-wrap;"></pre></p>
                <p class="text-muted"><span id="elapsed"></span> 秒內完成</p>
            </div>
        </div>
    </div>

    <script>
        const apiBase = "https://dict.hochi.org.tw:5165/api/admin";

        async function loadHealth() {
            const res = await fetch(`${apiBase}/health`);
            const data = await res.json();
            let status = data.status === 'ok' ? '✅ 正常' : '⚠️ 異常';
            document.getElementById('healthStatus').innerHTML =
                `狀態：${status}，CPU 使用率：${data.cpu}% ，記憶體使用率：${data.mem}%`;
        }

        async function loadSources() {
            const res = await fetch(`${apiBase}/source-files`);
            const result = await res.json(); // result 是 { file_count, files, folder }

            const list = document.getElementById('sourceFiles');
            list.innerHTML = '';

            result.files.forEach(f => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = f;
                list.appendChild(li);
            });
            document.getElementById('sourceInfo').textContent =
                `共 ${result.file_count} 本書`;
        }


        async function askQuestion() {
            const q = document.getElementById('questionInput').value.trim();
            if (!q) return;

            const res = await fetch(`${apiBase}/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: q, topK: 5 })
            });
            const data = await res.json();
            document.getElementById('qText').textContent = data.question;
            document.getElementById('aText').textContent = data.answer;
            document.getElementById('contextText').textContent = data.context.replace(/\n/g, "\n");
            document.getElementById('elapsed').textContent = data.elapsed_sec;
        }

        document.getElementById('askBtn').addEventListener('click', askQuestion);
        window.addEventListener('DOMContentLoaded', () => {
            loadHealth();
            loadSources();
        });
    </script>
</asp:Content>