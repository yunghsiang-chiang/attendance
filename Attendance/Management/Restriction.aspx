<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Restriction.aspx.cs" Inherits="Attendance.Management.Restriction" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <h1>禁止異動期間</h1>
    <h2>1. 保護數據完整性</h2>
    <ul>
        <li><strong>防止錯誤修改：</strong>在特定的考勤結算期間，禁止任何異動可以防止數據錯誤或不一致。</li>
        <li><strong>保持歷史記錄：</strong>確保已經核算的出勤記錄不被更改，以便於未來的審計和查詢。</li>
    </ul>

    <h2>2. 提升管理效率</h2>
    <ul>
        <li><strong>簡化審核流程：</strong>在禁止異動期間內，HR 或管理者可以專心於考勤核對、薪資計算等工作。</li>
        <li><strong>明確的政策規範：</strong>設置禁止異動的期間可以讓員工知道何時不能申請調整出勤紀錄。</li>
    </ul>

    <h2>3. 法規遵循</h2>
    <ul>
        <li><strong>遵循公司政策或法律要求：</strong>根據勞動法規或內部政策要求在特定期間內對考勤記錄進行鎖定。</li>
    </ul>

    <h2>4. 可能的應用場景</h2>
    <ul>
        <li><strong>薪資結算期：</strong>每個月的特定時間，例如月初或月末。</li>
        <li><strong>報表生成期：</strong>在生成考勤報告、業績報告等之前的幾天。</li>
    </ul>

    <h2>5. 實施建議</h2>
    <ul>
        <li><strong>設置靈活的時間段：</strong>系統允許 HR 自行設定禁止異動的開始與結束日期。</li>
        <li><strong>通知機制：</strong>在禁止異動期間內，系統自動通知相關員工，避免不必要的請求。</li>
    </ul>
</asp:Content>