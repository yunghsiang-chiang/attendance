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
            //TextBox tb_account = (TextBox)this.Page.FindControl("tb_account");
            //string str_accound="";
            //if (tb_account != null)
            //{
            //    str_accound = tb_account.Text;
            //}
            //TextBox tb_password = (TextBox)this.Page.FindControl("tb_password");
            //string str_password="";
            //if (tb_account != null)
            //{
            //    str_password = tb_password.Text;
            //}

            String str_accound = Request.Form["tb_account"].ToString();
            String str_password = Request.Form["tb_password"].ToString();

            DataTable logindt = new DataTable();
            logindt = clsDB.MySQL_Select("SELECT person_id, person_name, person_password, person_area, person_subinv,person_calendar FROM hochi_config.c_fellow_hochi_learners\r\nwhere person_id = '" + str_accound + "' and person_password = MD5('" + str_password + "')");
            if (logindt.Rows.Count > 0)
            {
                //產生一個Cookie
                HttpCookie cookie = new HttpCookie("person");
                //設定單值
                cookie["person_id"] = Server.UrlEncode(logindt.Rows[0]["person_id"].ToString());
                cookie["person_name"] = Server.UrlEncode(logindt.Rows[0]["person_name"].ToString());
                cookie["person_area"] = Server.UrlEncode(logindt.Rows[0]["person_area"].ToString());
                cookie["person_subinv"] = Server.UrlEncode(logindt.Rows[0]["person_subinv"].ToString());
                cookie["person_calendar"] = Server.UrlEncode(logindt.Rows[0]["person_calendar"].ToString());
                //設定過期日
                cookie.Expires = DateTime.Now.AddDays(365);
                //寫到用戶端
                Response.Cookies.Add(cookie);
                //套轉回原本網址
                Response.Redirect(Request.QueryString["beforeUrls"]);
            }

            Response.Write("<script>alert('功能撰寫中...\\n帳號:" + str_accound + "\\n密碼:" + str_password + "');</script>");
        }
    }
}