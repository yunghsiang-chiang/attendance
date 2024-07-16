<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Attendance._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <main>
        <section>
            <h2><strong>分頁介紹</strong></h2>
            <p><b>attendance</b>:提供打卡/請假/公務，需登入使用者，由IP區分使用者位於慈場與否</p>
            <p><b>attendance_history</b>:提供打卡紀錄觀看，登入者若為機要則可觀看其他同修打卡紀錄</p>
            <p><b>Attendance_calendar</b>:以Google日曆方式呈現月打卡情況，登入者若為機要則可以觀看其他同修月打卡情況</p>
        </section>
    </main>
</asp:Content>
