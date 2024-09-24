<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Reports.aspx.cs" Inherits="Attendance.Management.Reports" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <h1>出勤系統報表介紹</h1>

    <h2>1. 出勤總表</h2>
    <ul>
        <li><strong>用意:</strong> 提供所有員工的出勤記錄，包括每位員工的出勤天數、缺席天數、遲到早退等資訊，幫助 HR 評估員工的出勤狀況。</li>
        <li><strong>數據內容:</strong> 員工姓名、員工編號、出勤天數、缺席天數、遲到次數、早退次數。</li>
    </ul>

    <h2>2. 請假報表</h2>
    <ul>
        <li><strong>用意:</strong> 顯示所有員工的請假記錄，包括請假類型、請假時間及請假狀態，便於監控請假趨勢。</li>
        <li><strong>數據內容:</strong> 員工姓名、請假類型、請假開始與結束日期、請假狀態（待審核、已批准、已拒絕）。</li>
    </ul>

    <h2>3. 加班報表</h2>
    <ul>
        <li><strong>用意:</strong> 顯示員工的加班狀況，包括加班日期、加班小時數和加班原因，以分析加班情況。</li>
        <li><strong>數據內容:</strong> 員工姓名、加班日期、加班小時、加班原因、狀態（待審核、已批准、已拒絕）。</li>
    </ul>

    <h2>4. 出勤率報表</h2>
    <ul>
        <li><strong>用意:</strong> 提供每位員工的出勤率，幫助 HR 評估整體出勤狀況及各部門的出勤表現。</li>
        <li><strong>數據內容:</strong> 員工姓名、出勤天數、總工作天數、出勤率（計算公式：出勤天數 / 總工作天數）。</li>
    </ul>

    <h2>5. 遲到早退報表</h2>
    <ul>
        <li><strong>用意:</strong> 專注於員工的遲到和早退情況，幫助 HR 辨識潛在問題，保持良好工作紀律。</li>
        <li><strong>數據內容:</strong> 員工姓名、遲到次數、遲到時間、早退次數、早退時間。</li>
    </ul>

    <h2>6. 簽核記錄報表</h2>
    <ul>
        <li><strong>用意:</strong> 顯示請假和加班的簽核情況，幫助 HR 了解請假和加班的審核效率和合規性。</li>
        <li><strong>數據內容:</strong> 員工姓名、請假/加班類型、申請日期、審核人、簽核狀態、簽核日期。</li>
    </ul>

</asp:Content>
