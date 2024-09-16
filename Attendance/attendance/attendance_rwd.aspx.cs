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
            if (!IsPostBack)
            {
                clsDB clsDB = new clsDB();
                DataTable dt = new DataTable();
                dt = clsDB.MySQL_Select("SELECT attendance_days FROM attendance.c_attendance_calendar where calendar_year="+DateTime.Now.Year.ToString()+" and calendar_month = "+DateTime.Now.Month.ToString());
                if (dt.Rows.Count>0)
                {
                    string[] temp_array = dt.Rows[0][0].ToString().Split(',');
                    string temp_attendance_days = String.Join("'.'", temp_array);
                    //產生一個Cookie
                    HttpCookie cookie = new HttpCookie("attendance_days");
                    //設定單值
                    cookie.Value = temp_attendance_days;
                    //設定過期日 當天晚上23:59:59
                    cookie.Expires = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 23:59:59");
                    //寫到用戶端
                    Response.Cookies.Add(cookie);
                }

            }

        }
        
    }


}