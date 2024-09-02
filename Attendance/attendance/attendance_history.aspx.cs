using Attendance.App_Code;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Attendance.attendance
{
    public partial class attendance_history : System.Web.UI.Page
    {
        //clsDB clsDB = new clsDB();
        protected void Page_Load(object sender, EventArgs e)
        {
//            HttpCookie cookie = Request.Cookies["person"];
//            if (cookie == null)
//            {
//                Response.Redirect("~/login_attendance.aspx?beforeUrls=" + Request.Url.AbsoluteUri);
//            }
//            if (!IsPostBack)
//            {
//                List<string> power_group = new List<string> { "郭玲怡", "黃蘋" };
//                HttpCookie reqCookies = Request.Cookies["person"];
//                if (reqCookies != null)
//                {
//                    string user_name = Server.UrlDecode(reqCookies["person_name"].ToString());
//                    DataTable databyMon = new DataTable();
//                    if (power_group.IndexOf(user_name) == -1)
//                    {
//                        databyMon = clsDB.MySQL_Select(@"
//Select user_name,attendance_state '狀態',count(attendance_state) '天數',sum(consecutive_hours) 'Hours',sum(morning_light_up)'晨光上',sum(morning_light_down)'晨光下',sum(morning_meeting)'晨會'
//from attendance.h_attendance_day
//where user_name = '" + user_name + @"' and year(attendance_day) = " + DateTime.Now.Year.ToString() + @" and month(attendance_day) = " + DateTime.Now.Month.ToString() + @"
//group by user_name,attendance_state ");
//                    }
//                    else
//                    {
//                        databyMon = clsDB.MySQL_Select(@"
//Select user_name, attendance_state '狀態',count(attendance_state) '天數',sum(consecutive_hours) 'Hours',sum(morning_light_up)'晨光上',sum(morning_light_down)'晨光下',sum(morning_meeting)'晨會'
//from attendance.h_attendance_day
//where year(attendance_day) = " + DateTime.Now.Year.ToString() + @" and month(attendance_day) = " + DateTime.Now.Month.ToString() + @"
//group by user_name,attendance_state ");
//                    }

//                    if (databyMon.Rows.Count > 0)
//                    {
//                        gv_byMon.DataSource = databyMon;
//                        gv_byMon.DataBind();
//                    }
//                    else
//                    {
//                        gv_byMon.DataSource = null;
//                        gv_byMon.DataBind();
//                    }
//                }

//            }
        }
    }
}