<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="attendance_history.aspx.cs" Inherits="Attendance.attendance.attendance_history" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <script src="../Scripts/attendance/attendance_history.js"></script>
    <main>
        <section>

            <header>
                <h2>出勤紀錄查詢介面</h2>
                <p>
                    <b>2024/9/2 重製，原先僅聚焦到班，而系統擴增為 出勤</b>
                    <b>查詢同修出勤功能:機要工作需求等才有開放~</b>
                </p>
            </header>
            <section id="query-form">
                <form id="search-form">
                    <label for="name-select">選擇姓名：</label>
                    <select id="name-select" name="name">
                        <option value="">請選擇</option>
                        <!-- 使用後端語言或 JavaScript 填充選項 -->
                        <!-- 更多選項 -->
                    </select>

                    <label for="start-date">開始日期：</label>
                    <input type="date" id="start-date" name="start-date">

                    <label for="end-date">結束日期：</label>
                    <input type="date" id="end-date" name="end-date">

                    <input type="button" id="search" value="搜尋" />
                </form>
            </section>
            <!-- 考量排版，先統計再明細，統計資訊就不會被冗長的明細資料排到下方 -->
            <section id="statistics">
                <h2>姓名統計表格</h2>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>姓名</th>
                            <th>出勤天數</th>
                            <th>加班時數</th>
                            <th>事假時數</th>
                            <th>特休時數</th>
                            <th>病假時數</th>
                            <th>補休時數</th>
                            <th>生理假時數</th>
                        </tr>
                    </thead>
                    <tbody id="statistics-tbody">
                        <!-- 使用後端語言或 JavaScript 填充數據 -->
                    </tbody>
                </table>
            </section>
            <section id="records">
                <h2>時間記錄清單</h2>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>姓名</th>
                            <th>狀態</th>
                            <th>時間</th>
                        </tr>
                    </thead>
                    <tbody id="records-tbody">
                        <!-- 使用後端語言或 JavaScript 填充數據 -->
                    </tbody>
                </table>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>姓名</th>
                            <th>狀態</th>
                            <th>起始</th>
                            <th>結束</th>
                            <th>小時數</th>
                        </tr>
                    </thead>
                    <tbody id="overtime-records-tbody">
                        <!-- 使用後端語言或 JavaScript 填充數據 -->
                    </tbody>
                </table>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>姓名</th>
                            <th>狀態</th>
                            <th>起始</th>
                            <th>結束</th>
                            <th>小時數</th>
                        </tr>
                    </thead>
                    <tbody id="leave-records-tbody">
                        <!-- 使用後端語言或 JavaScript 填充數據 -->
                    </tbody>
                </table>

            </section>
        </section>
    </main>
</asp:Content>
