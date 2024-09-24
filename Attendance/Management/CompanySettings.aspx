<%@ Page Title="" Language="C#" MasterPageFile="~/Wpadmin.Master" AutoEventWireup="true" CodeBehind="CompanySettings.aspx.cs" Inherits="Attendance.Management.CompanySettings" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <h1>公司設定 - 出勤資訊</h1>

    <h2>1. 考勤時間設定</h2>
    <ul>
        <li><strong>說明:</strong> 設定公司全體員工的工作時間，包括上班和下班時間，以及午休時段。</li>
        <li><strong>例子:</strong> 
            <ul>
                <li>正常上班時間：上午9:00至下午6:00</li>
                <li>午休時間：中午12:30至下午1:30</li>
            </ul>
        </li>
    </ul>

    <h2>2. 假日安排</h2>
    <ul>
        <li><strong>說明:</strong> 設定公司的法定假日、特別假期和調休安排。</li>
        <li><strong>例子:</strong>
            <ul>
                <li>法定假日：元旦、國慶等</li>
                <li>調休：如端午節的假期調整</li>
            </ul>
        </li>
    </ul>

    <h2>3. 出勤政策</h2>
    <ul>
        <li><strong>說明:</strong> 制定公司的出勤政策，包括遲到、早退和缺勤的規範。</li>
        <li><strong>例子:</strong> 
            <ul>
                <li>遲到超過30分鐘將會扣除當天工資</li>
                <li>每位員工每年可請假天數不超過15天</li>
            </ul>
        </li>
    </ul>

    <h2>4. 加班政策</h2>
    <ul>
        <li><strong>說明:</strong> 設定加班的相關政策，包括加班的計算方式、補償方式和申請流程。</li>
        <li><strong>例子:</strong>
            <ul>
                <li>加班時數需提前申請並經主管批准</li>
                <li>加班時薪為正常時薪的1.5倍</li>
            </ul>
        </li>
    </ul>

    <h2>5. 請假管理</h2>
    <ul>
        <li><strong>說明:</strong> 設定請假的流程和審核權限，確定不同類型請假的批准人。</li>
        <li><strong>例子:</strong>
            <ul>
                <li>病假需要提供醫生證明</li>
                <li>事假需主管簽名批准</li>
            </ul>
        </li>
    </ul>

    <h2>6. 通知設定</h2>
    <ul>
        <li><strong>說明:</strong> 設定系統內部通知的內容及發送方式。</li>
        <li><strong>例子:</strong>
            <ul>
                <li>每月第一個工作日自動發送上個月的出勤報告給 HR</li>
                <li>當員工請假申請被批准或拒絕時，發送通知給相關員工</li>
            </ul>
        </li>
    </ul>

    <h2>7. 資料保護與隱私政策</h2>
    <ul>
        <li><strong>說明:</strong> 設定公司在出勤數據上的資料保護措施和隱私政策。</li>
        <li><strong>例子:</strong>
            <ul>
                <li>員工的出勤資料僅限 HR 和管理層查閱</li>
                <li>定期備份出勤數據以防資料丟失</li>
            </ul>
        </li>
    </ul>

    <h2>8. 系統訪問權限</h2>
    <ul>
        <li><strong>說明:</strong> 管理誰能訪問出勤系統及其各個功能的權限。</li>
        <li><strong>例子:</strong>
            <ul>
                <li>HR 具有全權管理出勤資料的權限</li>
                <li>一般員工僅能查看自己的出勤紀錄</li>
            </ul>
        </li>
    </ul>
</asp:Content>
