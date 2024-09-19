using Attendance.App_Code;
using System;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using System.Data;
using System.Net;

namespace Attendance.attendance
{
    
    public partial class attendance_rwd : System.Web.UI.Page
    {
        
        protected void Page_Load(object sender, EventArgs e)
        {
            //由於IP資訊只能從伺服器端取得，無法使用JavaScript在客戶端取得
            //因此透過伺服器並丟到Cookie提供JavaScript變更配置
            //取得IP與登入資訊皆從login頁面取得!
            // !IsPostBack = 第一次載入


        }
        
    }


}