<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Attendance_calendar.aspx.cs" Inherits="Attendance.attendance.Attendance_calendar" %>
<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <main>
    <section>
        <p><strong>此處會使用iframe 將 Google 日曆套入</strong></p>
        <p>需要稍等待Google日曆 API相關設定</p>
        <p>透過後台程式 新增/刪除/修改 Google日曆內容</p>
        <p>Google Calendar免費上限:60個日曆</p>
        <div class="embed-responsive embed-responsive-1by1">
            <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FTaipei&bgcolor=%23ffffff&src=Y184ZmNmOWM5ZmY1OGZiMTE1ZGFlN2EwMjkzZWFmNjg5NzkwNjJmZGFmMThjNjBkNmYyMjk2MjAzY2M2NDY5MjFhQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&src=Y18wZWJlYWE5OTI1YjBhNWFlODk5YTI0MTZhNmY1ZGVjMDA4YTZhODhjZGQ0ZDg2ZTZjMGZmYmQyMTRkYWQ2ZDA3QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&src=Y19hMGNkZDFmMzg2ODhmYjhkMzMxYTRlOTVkMzFiZDg0YmEwNGY0YjQ3NGZjNDllNWVmNTE0MTlhNjEzYWE4ZmMwQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&src=Y19kYTQ0OTEyYjFlOGZlODEyOGRhYjgwOTk5YzVmNjlmMzNmN2M1OWQ3MTMyZWRiNTJkMDUyM2I4YjU2NWI1OGMzQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%239E69AF&color=%23AD1457&color=%23AD1457&color=%233F51B5" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="yes"></iframe>
        </div>
    </section>
</main>
</asp:Content>
