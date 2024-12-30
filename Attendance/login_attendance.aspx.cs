using Attendance.App_Code;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Attendance
{
    public partial class login_attendance : System.Web.UI.Page
    {
        //宣告 資料庫連線
        clsDB clsDB = new clsDB();
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        /// <summary>
        /// 登入
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_submit_Click(object sender, EventArgs e)
        {


            String str_accound = Request.Form["tb_account"].ToString();
            String str_password = Request.Form["tb_password"].ToString();

            DataTable logindt = new DataTable();
            logindt = clsDB.MySQL_Select("SELECT person_id, person_name, person_password, person_area, person_subinv,person_calendar FROM hochi_config.c_fellow_hochi_learners where person_id = '" + str_accound + "' and person_password = MD5('" + str_password + "')");
            if (logindt.Rows.Count > 0)
            {
                //ip address
                string temp_ip_str = clsDB.GetIPAddress();
                //產生一個Cookie
                HttpCookie cookie = new HttpCookie("person");
                //設定單值
                cookie["temp_value"] = "temp";
                cookie["person_id"] = Server.UrlEncode(logindt.Rows[0]["person_id"].ToString());
                cookie["person_name"] = Server.UrlEncode(logindt.Rows[0]["person_name"].ToString());
                cookie["person_area"] = Server.UrlEncode(logindt.Rows[0]["person_area"].ToString());
                cookie["person_subinv"] = Server.UrlEncode(logindt.Rows[0]["person_subinv"].ToString());
                cookie["person_calendar"] = Server.UrlEncode(logindt.Rows[0]["person_calendar"].ToString());
                cookie["person_ipaddress"] = Server.UrlEncode(temp_ip_str);
                //設定過期日
                cookie.Expires = DateTime.Now.AddDays(365);
                // 設定 Cookie 的路徑，使其在整個網站可用
                cookie.Path = "/"; // 這行確保 Cookie 在整個網站可用

                //設置 SameSite 屬性
                cookie.SameSite = SameSiteMode.Strict;

                //寫到用戶端
                Response.Cookies.Add(cookie);

                //套轉回原本網址
                Response.Redirect(Request.QueryString["beforeUrls"]);
            }

            //Response.Write("<script>alert('功能撰寫中...\\n帳號:" + str_accound + "\\n密碼:" + str_password + "');</script>");
        }
    }
}