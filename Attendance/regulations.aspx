<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="regulations.aspx.cs" Inherits="Attendance.regulations" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container mt-5">
        <h2 class="text-center">台灣勞基法出勤狀態表</h2>
        <table class="table table-bordered table-striped">
            <thead class="thead-dark">
                <tr>
                    <th>休假名目</th>
                    <th>規定</th>
                    <th>天數</th>
                    <th>工資</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>婚假</td>
                    <td>勞工結婚</td>
                    <td>8 日</td>
                    <td>工資照給</td>
                </tr>
                <tr>
                    <td>喪假（父母、養父母、繼父母、配偶）</td>
                    <td>喪亡</td>
                    <td>8 日</td>
                    <td>工資照給</td>
                </tr>
                <tr>
                    <td>喪假（祖父母、子女、配偶之父母、配偶之養父母或繼父母）</td>
                    <td>喪亡</td>
                    <td>6 日</td>
                    <td>工資照給</td>
                </tr>
                <tr>
                    <td>喪假（曾祖父母、兄弟姊妹、配偶之祖父母）</td>
                    <td>喪亡</td>
                    <td>3 日</td>
                    <td>工資照給</td>
                </tr>
                <tr>
                    <td>普通傷病假（未住院）</td>
                    <td>一年內不得超過</td>
                    <td>30 日</td>
                    <td>工資折半發給</td>
                </tr>
                <tr>
                    <td>普通傷病假（住院）</td>
                    <td>二年內不得超過</td>
                    <td>1 年</td>
                    <td>工資折半發給</td>
                </tr>
                <tr>
                    <td>普通傷病假（未住院+住院）</td>
                    <td>二年內合計不得超過</td>
                    <td>1 年</td>
                    <td>工資折半發給</td>
                </tr>
                <tr>
                    <td>公傷病假</td>
                    <td>因職業災害失能、傷害或疾病</td>
                    <td>依實際需要</td>
                    <td>工資照給</td>
                </tr>
                <tr>
                    <td>事假</td>
                    <td>因事故親自處理</td>
                    <td>一年內合計不得超過 14 日</td>
                    <td>不給工資</td>
                </tr>
                <tr>
                    <td>公假</td>
                    <td>依法令規定</td>
                    <td>依實際需要</td>
                    <td>工資照給</td>
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
