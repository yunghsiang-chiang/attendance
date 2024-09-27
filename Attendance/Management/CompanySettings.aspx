<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="CompanySettings.aspx.cs" Inherits="Attendance.Management.CompanySettings" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Content/Management/CompanySettings.css" rel="stylesheet" />
    <script src="../Scripts/Management/CompanySettings.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">


    <main class="settings-container">
        <section class="setting-item">
            <h2>1. 考勤時間設定</h2>
            <p>設定員工每日的工作時間和午休時段。</p>
            <div class="attendance-times" id="attendance-times">
                <!-- 工作時間數據將顯示於此 -->
            </div>
        </section>

        <section class="setting-item">
            <h2>2. 假日安排</h2>
            <p>設定公司假期及法定假期的安排。</p>
        </section>

        <section class="setting-item">
            <h2>3. 出勤政策</h2>
            <p>設定員工的出勤規則與遵守的政策。</p>
        </section>

        <section class="setting-item">
            <h2>4. 加班政策</h2>
            <p>設定公司加班的政策與規則。</p>
        </section>

        <section class="setting-item">
            <h2>5. 請假管理</h2>
            <p>管理員工請假的申請與審批流程。</p>
        </section>

        <section class="setting-item">
            <h2>6. 通知設定</h2>
            <p>設定通知的接收方式與頻率。</p>
        </section>

        <section class="setting-item">
            <h2>7. 資料保護與隱私政策</h2>
            <p>確保員工資料的保護及隱私的安全。</p>
        </section>

        <section class="setting-item">
            <h2>8. 系統訪問權限</h2>
            <p>設定誰可以訪問系統的哪些部分。</p>
        </section>
    </main>
</asp:Content>
