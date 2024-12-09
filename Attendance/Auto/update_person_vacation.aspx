<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="update_person_vacation.aspx.cs" Inherits="Attendance.Auto.update_person_vacation" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link href="Content/themes/base/jquery-ui.css" rel="stylesheet" />

    <script src="../Scripts/jquery-3.7.0.js"></script>
    <script src="../Scripts/jquery-ui-1-13.3.js"></script>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <!-- Updated Bootstrap link -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Updated Bootstrap script -->
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            特休時數隨者入職日期逐年變化<br />
            <table class="table table-bordered table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>服務期間</th>
                        <th>特別休假天數</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>六個月以上一年未滿</td>
                        <td>3 日</td>
                    </tr>
                    <tr>
                        <td>一年以上二年未滿</td>
                        <td>7 日</td>
                    </tr>
                    <tr>
                        <td>二年以上三年未滿</td>
                        <td>10 日</td>
                    </tr>
                    <tr>
                        <td>三年以上五年未滿</td>
                        <td>14 日</td>
                    </tr>
                    <tr>
                        <td>五年以上十年未滿</td>
                        <td>15 日</td>
                    </tr>
                    <tr>
                        <td>十年以上</td>
                        <td>每一年加 1 日，加至 30 日為止</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </form>
</body>
</html>
