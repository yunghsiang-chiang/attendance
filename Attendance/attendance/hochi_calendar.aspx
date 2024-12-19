<%@ Page Title="和氣行事曆" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="hochi_calendar.aspx.cs" Inherits="Attendance.attendance.hochi_calendar" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <style>
        .calendar-container {
            margin-top: 20px;
        }

        .ibox {
            border: 1px solid #e7eaec;
            border-radius: 4px;
            background: #fff;
            margin-bottom: 20px;
            padding: 15px;
        }

        .ibox-title {
            margin-bottom: 10px;
        }

        .tab-content {
            margin-top: 15px;
        }

        iframe {
            width: 100%;
            height: 600px;
            border: none;
        }
    </style>
    <div class="container-fluid calendar-container">
    <div class="ibox">
        <div class="ibox-title">
            <h5>和氣大愛行事曆</h5>
            <div class="ibox-tools">
                <a class="collapse-link">
                    <i class="fa fa-chevron-up"></i>
                </a>
                <a class="close-link">
                    <i class="fa fa-times"></i>
                </a>
            </div>
        </div>
        <div class="tabs-container">
            <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" data-bs-toggle="tab" href="#tab-1">中心</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#tab-2">台北大區</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#tab-3">桃園大區</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#tab-4">台中大區</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#tab-5">高雄大區</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#tab-6">各軸線</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#tab-7">尋光階、一階</a>
                </li>
            </ul>
            <div class="tab-content">
                <div id="tab-1" class="tab-pane fade show active">
                    <div class="ibox-content">
                        <iframe src="https://calendar.google.com/calendar/embed?title=%E5%92%8C%E6%B0%A3%E5%A4%A7%E6%84%9B%E8%A1%8C%E4%BA%8B%E6%9B%86&amp;showPrint=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=zh.taiwan%23holiday%40group.v.calendar.google.com&amp;color=%23125A12&amp;src=hochi.org.tw_ckajfb8q97euf96drl4oqtvcp4%40group.calendar.google.com&amp;color=%235229A3&amp;src=hochi.org.tw_c1m95nhb6b2ke1r3gocund4nv0%40group.calendar.google.com&amp;color=%238C500B&amp;src=hochi.org.tw_oj5fbdtl83vnqro6sd3djkqb6g%40group.calendar.google.com&amp;color=%2323164E&amp;src=hochi.org.tw_8chec879qf6fih83ag9f9cr8e4%40group.calendar.google.com&amp;color=%232F6309&amp;src=hochi.org.tw_rc52s2cjf8oudnoms2ok9im5v0%40group.calendar.google.com&amp;color=%23B1365F&amp;src=hochi.org.tw_ihvvqi1qfcthjstr1l9qlo4nv0%40group.calendar.google.com&amp;color=%23875509&amp;src=hochi.org.tw_32pi89e9110u0aoplr2o3tbs88%40group.calendar.google.com&amp;color=%23125A12&amp;ctz=Asia%2FTaipei" scrolling="no"></iframe>
                    </div>
                </div>
                <div id="tab-2" class="tab-pane fade">
                    <div class="ibox-content">
                        <iframe src="https://calendar.google.com/calendar/b/1/embed?height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=hochi.org.tw_h1b9u2mnf4o294n26eul1dnb50%40group.calendar.google.com&amp;src=zh.taiwan%23holiday%40group.v.calendar.google.com&amp;color=%2342104A&amp;ctz=Asia%2FTaipei" scrolling="no"></iframe>
                    </div>
                </div>
                <div id="tab-3" class="tab-pane fade">
                    <div class="ibox-content">
                        <iframe src="https://calendar.google.com/calendar/b/1/embed?height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=hochi.org.tw_paqsrrg222numpd3ajp3ir99bc%40group.calendar.google.com&amp;src=zh.taiwan%23holiday%40group.v.calendar.google.com&amp;color=%2329527A&amp;ctz=Asia%2FTaipei" scrolling="no"></iframe>
                    </div>
                </div>
                <div id="tab-4" class="tab-pane fade">
                    <div class="ibox-content">
                        <iframe src="https://calendar.google.com/calendar/b/1/embed?height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=hochi.org.tw_0m39pjac1ueb5hegvh639nc8so%40group.calendar.google.com&amp;src=zh.taiwan%23holiday%40group.v.calendar.google.com&amp;color=%23875509&amp;ctz=Asia%2FTaipei" scrolling="no"></iframe>
                    </div>
                </div>
                <div id="tab-5" class="tab-pane fade">
                    <div class="ibox-content">
                        <iframe src="https://calendar.google.com/calendar/b/1/embed?height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=hochi.org.tw_n6not6jg4m740ki1m5p3ah7pt0%40group.calendar.google.com&amp;src=zh.taiwan%23holiday%40group.v.calendar.google.com&amp;color=%23182C57&amp;ctz=Asia%2FTaipei" scrolling="no"></iframe>
                    </div>
                </div>
                <div id="tab-6" class="tab-pane fade">
                    <div class="ibox-content">
                        <iframe src="https://calendar.google.com/calendar/b/1/embed?height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=axis.education%40hochi.org.tw&amp;color=%232F6309&amp;src=zh.taiwan%23holiday%40group.v.calendar.google.com&amp;color=%23125A12&amp;ctz=Asia%2FTaipei" scrolling="no"></iframe>
                    </div>
                </div>
                <div id="tab-7" class="tab-pane fade">
                    <div class="ibox-content">
                        <iframe src="https://calendar.google.com/calendar/b/1/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=Asia%2FTaipei&amp;src=aG9jaGkub3JnLnR3X2diZmhxaGJkbXQ5ZTN1b29qMWdtMTc2YW1jQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&amp;src=aG9jaGkub3JnLnR3XzJiNGh0NGZlcTlyMDY1MmJvdG9rMmczcXA0QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&amp;src=Y19vMmdxcGtobXFmYmRra3Q0NnBlb3BnZjhic0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%238A2D38&amp;color=%239D7000&amp;color=%23D81B60&amp;showTabs=1&amp;showTitle=1&amp;title=%E5%B0%8B%E5%85%89%E9%9A%8E%E3%80%81%E4%B8%80%E9%9A%8E%E9%96%8B%E7%8F%AD%E8%A1%8C%E4%BA%8B%E6%9B%86" scrolling="no"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</asp:Content>