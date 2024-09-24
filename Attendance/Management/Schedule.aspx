<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="Schedule.aspx.cs" Inherits="Attendance.Management.Schedule" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Content/Management/Schedule.css" rel="stylesheet" />

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="../Scripts/Management/Schedule.js"></script>
    <div class="container">
        <div class="month-controls">
            <input type="button" class="btn btn-primary" id="prevMonth" value="Previous Month" />
            <h2 id="monthLabel" class="mx-3"></h2>
            <input type="button" class="btn btn-primary" id="nextMonth" value="Next Month" />
        </div>

        <div class="calendar" id="calendar"></div>
        <input type="button" class="btn btn-success mt-4" id="saveButton" value="Save" />
    </div>
</asp:Content>
