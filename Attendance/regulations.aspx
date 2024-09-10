<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="regulations.aspx.cs" Inherits="Attendance.regulations" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container mt-5">
        <h2 class="text-center">台灣勞基法出勤狀態表</h2>
        <table class="table table-bordered table-striped">
            <thead class="thead-dark">
                <tr>
                    <th>假別</th>
                    <th>年資</th>
                    <th>法定天數</th>
                    <th>說明</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>事假</td>
                    <td>不限</td>
                    <td>14 天</td>
                    <td>每年不得超過14日，無薪</td>
                </tr>
                <tr>
                    <td>病假</td>
                    <td>不限</td>
                    <td>30 天</td>
                    <td>每年不得超過30日（合計病假與住院病假不得超過一年），病假期間內按工資之50%發給</td>
                </tr>
                <tr>
                    <td>病假（住院）</td>
                    <td>不限</td>
                    <td>1 年</td>
                    <td>每年不得超過1年，病假期間內按工資之50%發給</td>
                </tr>
                <tr>
                    <td>喪假</td>
                    <td>不限</td>
                    <td>8 天</td>
                    <td>配偶、父母或配偶之父母喪亡者給8日；祖父母或配偶之祖父母喪亡者給6日；兄弟姊妹喪亡者給3日，這些假期皆為有薪假</td>
                </tr>
                <tr>
                    <td>婚假</td>
                    <td>不限</td>
                    <td>8 天</td>
                    <td>勞工結婚可請婚假8日，這是有薪假</td>
                </tr>
                <tr>
                    <td>育嬰留職停薪</td>
                    <td>至少服務6個月</td>
                    <td>最多2年</td>
                    <td>子女滿3歲以前，雙親各可請最長2年育嬰留職停薪</td>
                </tr>
            </tbody>
        </table>
        <table class="table table-bordered table-striped">
            <thead class="thead-dark">
                <tr>
                    <td>
                        <h2>加班日類型</h2>
                    </td>
                    <td>
                        <h2>加班時間</h2>
                    </td>
                    <td>
                        <h2>加班費計算倍率</h2>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="2">
                        <p><strong>平日</strong></p>
                        <p><strong>&nbsp;</strong></p>
                    </td>
                    <td>第1-2小時</td>
                    <td>*1.34</td>
                </tr>
                <tr>
                    <td>第3-4小時</td>
                    <td>*1.67</td>
                </tr>
                <tr>
                    <td rowspan="3">
                        <p><strong>休息日</strong></p>
                        <p><strong>&nbsp;</strong></p>
                        <p><strong>&nbsp;</strong></p>
                    </td>
                    <td>第1-2小時</td>
                    <td>*1.34</td>
                </tr>
                <tr>
                    <td>第3-8小時</td>
                    <td>*1.67</td>
                </tr>
                <tr>
                    <td>第9-12小時</td>
                    <td>*2.67</td>
                </tr>
                <tr>
                    <td rowspan="3">
                        <p><strong>休假日（國定假日、特休）</strong></p>
                        <p><strong>&nbsp;</strong></p>
                        <p><strong>&nbsp;</strong></p>
                    </td>
                    <td>8小時以內</td>
                    <td>*1</td>
                </tr>
                <tr>
                    <td>第9-10小時</td>
                    <td>*1.34</td>
                </tr>
                <tr>
                    <td>第11-12小時</td>
                    <td>*1.67</td>
                </tr>
            </tbody>
        </table>
    </div>

</asp:Content>
