<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Management.aspx.cs" Inherits="Attendance.Management.Management" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <h1>出勤系統管理設定</h1>

    <h2>1. 員工管理</h2>
    <ul>
        <li><strong>功能說明:</strong> 允許 HR 添加、編輯和刪除員工的出勤資料，包括基本的員工資訊，如姓名、員工編號、部門、職位等。</li>
        <li><strong>用意:</strong> 確保系統中的員工資料是最新的，有效管理員工的出勤狀況。</li>
    </ul>

    <h2>2. 設定請假類型</h2>
    <ul>
        <li><strong>功能說明:</strong> HR 可以自定義不同的請假類型（如病假、事假、年假等），並設定每種請假類型的規則和限制。</li>
        <li><strong>用意:</strong> 方便員工了解可請的假別，同時讓 HR 便於管理和審核請假申請。</li>
    </ul>

    <h2>3. 加班設定</h2>
    <ul>
        <li><strong>功能說明:</strong> HR 可以設定加班的規則，例如哪些時間屬於加班、加班的補償方式等。</li>
        <li><strong>用意:</strong> 確保員工在加班時獲得合理的補償，並提升工作滿意度。</li>
    </ul>

    <h2>4. 禁止異動期間設定</h2>
    <ul>
        <li><strong>功能說明:</strong> HR 可以設定禁止異動的期間，防止在特定時間內對出勤資料進行修改。</li>
        <li><strong>用意:</strong> 保護出勤數據的完整性，確保在結算期間不會有不必要的數據更改。</li>
    </ul>

    <h2>5. 通知系統設定</h2>
    <ul>
        <li><strong>功能說明:</strong> 允許 HR 設定系統內部通知的發送規則，如電子郵件或系統通知。</li>
        <li><strong>用意:</strong> 提高員工的參與度，讓員工隨時了解自己的出勤狀況。</li>
    </ul>

    <h2>6. 報表生成設定</h2>
    <ul>
        <li><strong>功能說明:</strong> HR 可以自定義報表生成的時間、格式和內容，選擇需要的報表類型。</li>
        <li><strong>用意:</strong> 提供靈活性，讓 HR 能夠根據需要隨時生成所需的報表以進行分析和決策。</li>
    </ul>

    <h2>7. 幫助與支援</h2>
    <ul>
        <li><strong>功能說明:</strong> 提供幫助區域，包括使用手冊、常見問題和聯絡客服的資訊。</li>
        <li><strong>用意:</strong> 方便新手 HR 快速上手系統，遇到問題時能夠迅速找到解決方案。</li>
    </ul>

    <h2>8. 系統設置</h2>
    <ul>
        <li><strong>功能說明:</strong> HR 可以對系統進行基本的設置，如設定考勤時間、假日安排等。</li>
        <li><strong>用意:</strong> 確保系統符合公司的運作需求，提供有效的考勤管理環境。</li>
    </ul>
</asp:Content>
