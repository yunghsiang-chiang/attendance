<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="GrowthRecordEdit.aspx.cs" Inherits="Attendance.GrowthRecordEdit" %>

<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="css/plugins/datapicker/datepicker3.css" rel="stylesheet" />
    <link href="css/plugins/clockpicker/clockpicker.css" rel="stylesheet" />
    <link href="css/plugins/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css" rel="stylesheet" />
    <link href="js/plugins/audiojs/audiojs.css" rel="stylesheet" />
    <link href="css/plugins/ladda/ladda-themeless.min.css" rel="stylesheet" />
    <title>成長紀錄</title>
</head>
<body>
    <div class="row wrapper border-bottom white-bg page-heading">
        <div class="col-lg-10">
            <h2>成長紀錄 <small><span id="lTitle"></span></small></h2>
            <ol class="breadcrumb">
                <li><a href="Main.aspx"><i class='fa fa-home'></i></a></li>
                <li><a href="#">成長玉成</a></li>
                <li class="active"><strong>成長紀錄</strong></li>
            </ol>
        </div>
    </div>

    <div class="wrapper wrapper-content animated fadeInRight">
        <div class="row">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5><span id="lFunc"></span></h5>
                    </div>
                    <div class="ibox-content">
                        <div class="form-group">
                            <div class="col-sm-8 col-sm-offset-2">
                                <p class="text-danger">總結：導師每週幫光團夥伴總結</p>
                                <input type="radio" name="rbType" value="1" checked> 日誌
                                <input type="radio" name="rbType" value="2"> 應用
                                <input type="radio" name="rbType" value="3"> 提問
                                <input type="radio" name="rbType" value="4"> 回應
                                <input type="radio" name="rbType" value="5"> 新進度
                                <input type="radio" name="rbType" value="6"> 法脈結構進度
                                <input type="radio" name="rbType" value="7"> 總結
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label"><span class="keypoint">＊</span>記錄類別</label>
                            <div class="col-sm-10">
                                <div class="row">
                                    <div class="col-md-10">
                                        <input type="radio" name="rbCategory" value="2" checked> 愿
                                        <input type="radio" name="rbCategory" value="0"> 煉
                                        <input type="radio" name="rbCategory" value="3"> 修
                                        <input type="radio" name="rbCategory" value="1"> 行
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <div class="form-group" id="data_1">
                            <label class="col-sm-2 control-label"><span class="keypoint">＊</span>記錄時間</label>
                            <div class="col-sm-3">
                                <div class="input-group date">
                                    <span class="input-group-addon"><i class="fa fa-calendar"></i></span>
                                    <input type="text" id="txtRecordDate" class="form-control" maxlength="10">
                                </div>
                            </div>
                            <div class="col-sm-3">
                                <div class="input-group clockpicker" data-autoclose="true">
                                    <input type="text" id="txtRecordTime" class="form-control" maxlength="5" value="09:30">
                                    <span class="input-group-addon"><span class="fa fa-clock-o"></span></span>
                                </div>
                            </div>
                        </div>

                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <div class="col-sm-8 col-sm-offset-2">
                                <button type="button" class="btn btn-white" onclick="window.history.back();">回上頁</button>
                                <button type="button" class="btn btn-primary" onclick="saveRecord();">儲存</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/plugins/datapicker/bootstrap-datepicker.js"></script>
    <script src="js/plugins/clockpicker/clockpicker.js"></script>
    <script src="js/plugins/ladda/spin.min.js"></script>
    <script src="js/plugins/ladda/ladda.min.js"></script>
    <script src="js/plugins/ladda/ladda.jquery.min.js"></script>
    <script src="js/plugins/audiojs/audio.min.js"></script>
    <script src="js/plugins/validate/jquery.validate.min.js"></script>
    
    <script type="text/javascript">
        $(function () {
            $('#data_1 .input-group.date').datepicker({
                todayBtn: "linked",
                keyboardNavigation: false,
                forceParse: false,
                autoclose: true,
                format: "yyyy.mm.dd"
            });
            $('.clockpicker').clockpicker();
        });

        function saveRecord() {
            // 儲存邏輯
            alert('儲存成功！');
        }
    </script>
</body>
</html>