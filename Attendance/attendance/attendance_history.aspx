<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="attendance_history.aspx.cs" Inherits="Attendance.attendance.attendance_history" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
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
                        <option value="1">張三</option>
                        <option value="2">李四</option>
                        <!-- 更多選項 -->
                    </select>

                    <label for="start-date">開始日期：</label>
                    <input type="date" id="start-date" name="start-date">

                    <label for="end-date">結束日期：</label>
                    <input type="date" id="end-date" name="end-date">

                    <button type="submit">搜尋</button>
                </form>
            </section>

            <section id="records">
                <h2>時間記錄清單</h2>
                <table>
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
            </section>

            <section id="statistics">
                <h2>姓名統計表格</h2>
                <table>
                    <thead>
                        <tr>
                            <th>姓名</th>
                            <th>出勤天數</th>
                            <th>加班時數</th>
                            <th>請假時數</th>
                            <th>特休時數</th>
                            <th>補休時數</th>
                        </tr>
                    </thead>
                    <tbody id="statistics-tbody">
                        <!-- 使用後端語言或 JavaScript 填充數據 -->
                    </tbody>
                </table>
            </section>
            <%--<div class="col-md-6">
            <asp:GridView ID="gv_byMon" runat="server" BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" CellPadding="4" ForeColor="Black" GridLines="Vertical">
                <AlternatingRowStyle BackColor="White" />
                <FooterStyle BackColor="#CCCC99" />
                <HeaderStyle BackColor="#6B696B" Font-Bold="True" ForeColor="White" />
                <PagerStyle BackColor="#F7F7DE" ForeColor="Black" HorizontalAlign="Right" />
                <RowStyle BackColor="#F7F7DE" />
                <SelectedRowStyle BackColor="#CE5D5A" Font-Bold="True" ForeColor="White" />
                <SortedAscendingCellStyle BackColor="#FBFBF2" />
                <SortedAscendingHeaderStyle BackColor="#848384" />
                <SortedDescendingCellStyle BackColor="#EAEAD3" />
                <SortedDescendingHeaderStyle BackColor="#575357" />
            </asp:GridView>
        </div>
        <div class="col-md-6">
            <asp:GridView ID="gv_byDate" runat="server" CellPadding="4" ForeColor="#333333" GridLines="None">
                <AlternatingRowStyle BackColor="White" />
                <EditRowStyle BackColor="#7C6F57" />
                <FooterStyle BackColor="#1C5E55" Font-Bold="True" ForeColor="White" />
                <HeaderStyle BackColor="#1C5E55" Font-Bold="True" ForeColor="White" />
                <PagerStyle BackColor="#666666" ForeColor="White" HorizontalAlign="Center" />
                <RowStyle BackColor="#E3EAEB" />
                <SelectedRowStyle BackColor="#C5BBAF" Font-Bold="True" ForeColor="#333333" />
                <SortedAscendingCellStyle BackColor="#F8FAFA" />
                <SortedAscendingHeaderStyle BackColor="#246B61" />
                <SortedDescendingCellStyle BackColor="#D4DFE1" />
                <SortedDescendingHeaderStyle BackColor="#15524A" />
            </asp:GridView>
        </div>--%>
        </section>
    </main>
</asp:Content>
