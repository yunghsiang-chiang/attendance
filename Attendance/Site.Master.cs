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
    public partial class SiteMaster : MasterPage
    {
        //呼叫資料庫
        clsDB clsDB = new clsDB();
        protected void Page_Load(object sender, EventArgs e)
        {

            if (!IsPostBack)
            {
                string ip_address = clsDB.GetIPAddress();
                //如果有順利得到IP資訊
                if (ip_address.Split('.').Length == 4)
                {
                    DataTable get_ip_dt = new DataTable();
                    get_ip_dt = clsDB.MySQL_Select("SELECT area,sub_inv FROM hochi_config.c_ip_webarea where ipaddress like '" + String.Join(".", ip_address.Split('.').ToList().GetRange(0, 3)) + "%'");
                    if (get_ip_dt.Rows.Count > 0)
                    {
                        l_username.Text = get_ip_dt.Rows[0]["area"].ToString() + "慈場同修";
                    }
                }
            }
            HttpCookie reqCookies = Request.Cookies["person"];
            if (reqCookies != null)
            {
                l_username.Text = "編號:" + reqCookies["person_id"].ToString() + "姓名:" + Server.UrlDecode(reqCookies["person_name"].ToString()) + "慈場:" + Server.UrlDecode(reqCookies["person_area"].ToString());
                bt_login.Text = "登出";
            }
            else
            {
                bt_login.Text = "登入";
                // Request.Url.AbsoluteUri 當前網址
            }
        }
        /// <summary>
        /// 登入
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void bt_login_Click(object sender, EventArgs e)
        {
            if (bt_login.Text != "登出")
            {
                Response.Redirect("~/login_attendance.aspx?beforeUrls=" + Request.Url.AbsoluteUri);
            }
            else
            {
                HttpCookie reqCookies = Request.Cookies["person"];
                if (reqCookies != null)
                {
                    reqCookies.Expires = DateTime.Now;
                    Response.Cookies.Add(reqCookies);
                    Response.Redirect(Request.Url.AbsoluteUri);
                }
            }

            // Request.Url.AbsoluteUri 當前網址
            //Response.Write("<script> alert(\"Hello! 登入功能建構中...\") </script>");
        }
    }
}