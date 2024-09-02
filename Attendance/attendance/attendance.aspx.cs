using Attendance.App_Code;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services.Description;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Attendance.attendance
{
    public partial class attendance : System.Web.UI.Page
    {
        clsDB clsDB = new clsDB();
        googleCalendar googleCalendar = new googleCalendar();
        protected void Page_Load(object sender, EventArgs e)
        {
            HttpCookie cookie = Request.Cookies["person"];
            if (cookie == null)
            {
                Response.Redirect("~/login_attendance.aspx?beforeUrls=" + Request.Url.AbsoluteUri);
            }
            if (!IsPostBack)
            {
                //讓勾選選單 檢查是否有紀錄 有則復原狀態
                HttpCookie reqCookies_in = Request.Cookies["day_statu"];
                if (reqCookies_in != null)
                {
                    List<Button> buttons = new List<Button> { bt_start, bt_end, bt_going_out_on_business, bt_come_back, bt_dayoff };
                    cb_morning_up_in_hochi.Checked = Convert.ToBoolean(reqCookies_in["cb_morning_up"]);
                    cb_morning_down_in_hochi.Checked = Convert.ToBoolean(reqCookies_in["cb_morning_down"]);
                    cb_morning_meetnig_in_hochi.Checked = Convert.ToBoolean(reqCookies_in["cb_morning_meetnig"]);
                    buttons[Convert.ToInt16(reqCookies_in["button_id"])].Text = "🏃" + buttons[Convert.ToInt16(reqCookies_in["button_id"])].Text + "🏃";
                }
                //讓勾選選單 檢查是否有紀錄 有則復原狀態
                HttpCookie reqCookies_out = Request.Cookies["day_state"];
                if (reqCookies_out != null)
                {
                    List<Button> buttons = new List<Button> { bt_outside_business, bt_sick_leave, bt_menstrual_leave, bt_personal_leave, bt_compensatory_leave, bt_specaial_leave };
                    cb_morning_up_out_hochi.Checked = Convert.ToBoolean(reqCookies_out["cb_morning_up"]);
                    cb_morning_down_out_hochi.Checked = Convert.ToBoolean(reqCookies_out["cb_morning_down"]);
                    cb_morning_meetnig_out_hochi.Checked = Convert.ToBoolean(reqCookies_out["cb_morning_meetnig"]);
                    buttons[Convert.ToInt16(reqCookies_out["button_id"])].Text = "🏃" + buttons[Convert.ToInt16(reqCookies_out["button_id"])].Text + "🏃";
                }
            }
            //測試用，此處先寫死IP白名單字串，減少拜訪伺服器
            string temp_ip_str = clsDB.GetIPAddress();
            if (temp_ip_str.Contains("10.10.3") || temp_ip_str.Contains("10.10.1"))
            {
                p_inhochi.Visible = true;
                p_outhochi.Visible = false;
            }
            else
            {
                p_inhochi.Visible = false;
                p_outhochi.Visible = true;
            }
        }

        protected void Page_PreRender(object sender, EventArgs e)
        {

        }
        /// <summary>
        /// 按下 到班 按鈕
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_start_Click(object sender, EventArgs e)
        {
            List<Button> buttons = new List<Button> { bt_start, bt_end, bt_going_out_on_business, bt_come_back, bt_dayoff };
            List<string> strings = new List<string> { "到班", "下班", "外出公務", "回崗", "請假" };
            for (int i = 0; i < buttons.Count; i++)
            {
                buttons[i].Text = strings[i];
            }
            bt_start.Text = "🏃到班🏃";
            cookie_by_day_state("in", bt_start);
            Response.Write("<script>alert('按了到班按鈕');</script>");
            DateTime start = DateTime.Now;
            DateTime end = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 18:00:00");
            HttpCookie reqCookies = Request.Cookies["person"];
            if (reqCookies != null)
            {
                string calendarid = Server.UrlDecode(reqCookies["person_calendar"].ToString());
                googleCalendar.Add_new_event("test project", /*"測試 " +*/ Server.UrlDecode(reqCookies["person_name"].ToString()) + " 到班", "Asia/Taipei", start, end, calendarid);
            }
        }
        /// <summary>
        /// 按下 下班 按鈕
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_end_Click(object sender, EventArgs e)
        {
            List<Button> buttons = new List<Button> { bt_start, bt_end, bt_going_out_on_business, bt_come_back, bt_dayoff };
            List<string> strings = new List<string> { "到班", "下班", "外出公務", "回崗", "請假" };
            for (int i = 0; i < buttons.Count; i++)
            {
                buttons[i].Text = strings[i];
            }
            bt_end.Text = "🏃下班🏃";
            cookie_by_day_state("in", bt_end);
            Response.Write("<script>alert('按了下班按鈕');</script>");

        }
        /// <summary>
        /// 按下 外出公務 按鈕
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_going_out_on_business_Click(object sender, EventArgs e)
        {
            List<Button> buttons = new List<Button> { bt_start, bt_end, bt_going_out_on_business, bt_come_back, bt_dayoff };
            List<string> strings = new List<string> { "到班", "下班", "外出公務", "回崗", "請假" };
            for (int i = 0; i < buttons.Count; i++)
            {
                buttons[i].Text = strings[i];
            }
            bt_going_out_on_business.Text = "🏃外出公務🏃";
            cookie_by_day_state("in", bt_going_out_on_business);
            Response.Write("<script>alert('按了外出公務按鈕');</script>");
        }
        /// <summary>
        /// 按下 回崗 按鈕
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_come_back_Click(object sender, EventArgs e)
        {
            List<Button> buttons = new List<Button> { bt_start, bt_end, bt_going_out_on_business, bt_come_back, bt_dayoff };
            List<string> strings = new List<string> { "到班", "下班", "外出公務", "回崗", "請假" };
            for (int i = 0; i < buttons.Count; i++)
            {
                buttons[i].Text = strings[i];
            }
            bt_come_back.Text = "🏃回崗🏃";
            cookie_by_day_state("in", bt_come_back);
            Response.Write("<script>alert('按了回崗按鈕');</script>");
        }
        /// <summary>
        /// 按下 請假 按鈕
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_dayoff_Click(object sender, EventArgs e)
        {
            List<Button> buttons = new List<Button> { bt_start, bt_end, bt_going_out_on_business, bt_come_back, bt_dayoff };
            List<string> strings = new List<string> { "到班", "下班", "外出公務", "回崗", "請假" };
            for (int i = 0; i < buttons.Count; i++)
            {
                buttons[i].Text = strings[i];
            }
            bt_dayoff.Text = "🏃請假🏃";
            cookie_by_day_state("in", bt_dayoff);
            Response.Write("<script>alert('按了請假按鈕');</script>");
        }
        /// <summary>
        /// 紀錄 晨光上/下/晨會 勾選紀錄 by Day
        /// 也就是 今天勾選後 拜訪網頁都會看到 勾選的狀態 直到 隔天
        /// </summary>
        protected void cookie_by_day_state(string inout, Button button)
        {
            //在 慈場的 互動cookie
            if (inout == "in")
            {
                List<Button> buttons = new List<Button> { bt_start, bt_end, bt_going_out_on_business, bt_come_back, bt_dayoff };
                HttpCookie reqCookies = Request.Cookies["day_statu"];
                if (reqCookies != null)
                {
                    //如果已經存在 先檢查是否有變更,才變更cookie狀態
                    //任一變更
                    if (reqCookies["cb_morning_up"] != (cb_morning_up_in_hochi.Checked.ToString()) || reqCookies["cb_morning_down"] != (cb_morning_down_in_hochi.Checked.ToString()) || reqCookies["cb_morning_meetnig"] != (cb_morning_meetnig_in_hochi.Checked.ToString()) || reqCookies["button_id"] != buttons.IndexOf(button).ToString())
                    {
                        //讓原本的cookie 失效
                        reqCookies.Expires = DateTime.Now.AddDays(-1);
                        Response.Cookies.Add(reqCookies);
                        //產生一個Cookie
                        HttpCookie cookie = new HttpCookie("day_statu");
                        //設定單值
                        cookie["cb_morning_up"] = Server.UrlEncode(cb_morning_up_in_hochi.Checked.ToString());
                        cookie["cb_morning_down"] = Server.UrlEncode(cb_morning_down_in_hochi.Checked.ToString());
                        cookie["cb_morning_meetnig"] = Server.UrlEncode(cb_morning_meetnig_in_hochi.Checked.ToString());
                        cookie["button_id"] = Server.UrlEncode(buttons.IndexOf(button).ToString());
                        //設定過期日 當天晚上23:59:59
                        cookie.Expires = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 23:59:59");
                        //寫到用戶端
                        Response.Cookies.Add(cookie);
                        //上傳資料至 資料庫
                        HttpCookie person = Request.Cookies["person"];
                        string user_name = Server.UrlDecode(person["person_name"].ToString());
                        int morning_light_up = 0;
                        int morning_light_down = 0;
                        int morning_meeting = 0;
                        string attendance_state = "出勤";
                        if (cb_morning_up_in_hochi.Checked)
                            morning_light_up = 1;

                        if (cb_morning_down_in_hochi.Checked)
                            morning_light_down = 1;

                        if (cb_morning_meetnig_in_hochi.Checked)
                            morning_meeting = 1;

                        if (button == bt_dayoff)
                            attendance_state = "請假";

                        send_data_to_sql_byDate(user_name, attendance_state, 8, morning_light_up, morning_light_down, morning_meeting);
                        send_data_to_sql_byTime(user_name, button.Text, DateTime.Now);
                    }
                    //此處不動作,避免同修點選兩次相同狀態按鈕
                }
                else
                {
                    //產生一個Cookie
                    HttpCookie cookie = new HttpCookie("day_statu");
                    //設定單值
                    cookie["cb_morning_up"] = Server.UrlEncode(cb_morning_up_in_hochi.Checked.ToString());
                    cookie["cb_morning_down"] = Server.UrlEncode(cb_morning_down_in_hochi.Checked.ToString());
                    cookie["cb_morning_meetnig"] = Server.UrlEncode(cb_morning_meetnig_in_hochi.Checked.ToString());
                    cookie["button_id"] = Server.UrlEncode(buttons.IndexOf(button).ToString());
                    //設定過期日 當天晚上23:59:59
                    cookie.Expires = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 23:59:59");
                    //寫到用戶端
                    Response.Cookies.Add(cookie);
                    //上傳資料至 資料庫
                    HttpCookie person = Request.Cookies["person"];
                    string user_name = Server.UrlDecode(person["person_name"].ToString());
                    int morning_light_up = 0;
                    int morning_light_down = 0;
                    int morning_meeting = 0;
                    string attendance_state = "出勤";
                    if (cb_morning_up_in_hochi.Checked)
                        morning_light_up = 1;

                    if (cb_morning_down_in_hochi.Checked)
                        morning_light_down = 1;

                    if (cb_morning_meetnig_in_hochi.Checked)
                        morning_meeting = 1;

                    if (button == bt_dayoff)
                        attendance_state = "請假";

                    send_data_to_sql_byDate(user_name, attendance_state, 8, morning_light_up, morning_light_down, morning_meeting);
                    send_data_to_sql_byTime(user_name, button.Text, DateTime.Now);
                }
            }
            else if (inout == "out")
            {
                List<Button> buttons = new List<Button> { bt_outside_business, bt_sick_leave, bt_menstrual_leave, bt_personal_leave, bt_compensatory_leave, bt_specaial_leave };
                HttpCookie reqCookies = Request.Cookies["day_state"];
                if (reqCookies != null)
                {
                    //如果已經存在 先檢查是否有變更,才變更cookie狀態
                    //任一變更
                    if (reqCookies["cb_morning_up"] != (cb_morning_up_out_hochi.Checked.ToString()) || reqCookies["cb_morning_down"] != (cb_morning_down_out_hochi.Checked.ToString()) || reqCookies["cb_morning_meetnig"] != (cb_morning_meetnig_out_hochi.Checked.ToString()) || reqCookies["button_id"] != buttons.IndexOf(button).ToString())
                    {
                        //讓原本的cookie 失效
                        reqCookies.Expires = DateTime.Now.AddDays(-1);
                        Response.Cookies.Add(reqCookies);
                        //產生一個Cookie
                        HttpCookie cookie = new HttpCookie("day_state");
                        //設定單值
                        cookie["cb_morning_up"] = Server.UrlEncode(cb_morning_up_out_hochi.Checked.ToString());
                        cookie["cb_morning_down"] = Server.UrlEncode(cb_morning_down_out_hochi.Checked.ToString());
                        cookie["cb_morning_meetnig"] = Server.UrlEncode(cb_morning_meetnig_out_hochi.Checked.ToString());
                        cookie["button_id"] = Server.UrlEncode(buttons.IndexOf(button).ToString());
                        //設定過期日 當天晚上23:59:59
                        cookie.Expires = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 23:59:59");
                        //寫到用戶端
                        Response.Cookies.Add(cookie);
                        //上傳資料至 資料庫
                        HttpCookie person = Request.Cookies["person"];
                        string user_name = Server.UrlDecode(person["person_name"].ToString());
                        int morning_light_up = 0;
                        int morning_light_down = 0;
                        int morning_meeting = 0;
                        string attendance_state = "請假";
                        if (cb_morning_up_in_hochi.Checked)
                            morning_light_up = 1;

                        if (cb_morning_down_in_hochi.Checked)
                            morning_light_down = 1;

                        if (cb_morning_meetnig_in_hochi.Checked)
                            morning_meeting = 1;

                        if (button == bt_outside_business)
                            attendance_state = "出勤";

                        send_data_to_sql_byDate(user_name, attendance_state, 8, morning_light_up, morning_light_down, morning_meeting);
                        send_data_to_sql_byTime(user_name, button.Text, DateTime.Now);
                    }
                }
                else
                {
                    //產生一個Cookie
                    HttpCookie cookie = new HttpCookie("day_state");
                    //設定單值
                    cookie["cb_morning_up"] = Server.UrlEncode(cb_morning_up_out_hochi.Checked.ToString());
                    cookie["cb_morning_down"] = Server.UrlEncode(cb_morning_down_out_hochi.Checked.ToString());
                    cookie["cb_morning_meetnig"] = Server.UrlEncode(cb_morning_meetnig_out_hochi.Checked.ToString());
                    cookie["button_id"] = Server.UrlEncode(buttons.IndexOf(button).ToString());
                    //設定過期日 當天晚上23:59:59
                    cookie.Expires = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 23:59:59");
                    //寫到用戶端
                    Response.Cookies.Add(cookie);
                    //上傳資料至 資料庫
                    HttpCookie person = Request.Cookies["person"];
                    string user_name = Server.UrlDecode(person["person_name"].ToString());
                    int morning_light_up = 0;
                    int morning_light_down = 0;
                    int morning_meeting = 0;
                    string attendance_state = "請假";
                    if (cb_morning_up_in_hochi.Checked)
                        morning_light_up = 1;

                    if (cb_morning_down_in_hochi.Checked)
                        morning_light_down = 1;

                    if (cb_morning_meetnig_in_hochi.Checked)
                        morning_meeting = 1;

                    if (button == bt_outside_business)
                        attendance_state = "出勤";

                    send_data_to_sql_byDate(user_name, attendance_state, 8, morning_light_up, morning_light_down, morning_meeting);
                    send_data_to_sql_byTime(user_name, button.Text, DateTime.Now);
                }
            }

        }
        /// <summary>
        /// 按下 外出公務 按鈕
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_outside_business_Click(object sender, EventArgs e)
        {
            List<Button> buttons = new List<Button> { bt_outside_business, bt_sick_leave, bt_menstrual_leave, bt_personal_leave, bt_compensatory_leave, bt_specaial_leave };
            List<string> strings = new List<string> { "外出公務", "請病假", "請生理假", "請事假", "補休", "特休" };
            for (int i = 0; i < buttons.Count; i++)
            {
                buttons[i].Text = strings[i];
            }
            bt_outside_business.Text = "🏃外出公務🏃";
            cookie_by_day_state("out", bt_outside_business);
            Response.Write("<script>alert('按了外出公務按鈕');</script>");
            DateTime start = DateTime.Now;
            DateTime end = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 18:00:00");
            HttpCookie reqCookies = Request.Cookies["person"];
            if (reqCookies != null)
            {
                string calendarid = Server.UrlDecode(reqCookies["person_calendar"].ToString());
                googleCalendar.Add_new_event("test project", /*"測試 " +*/ Server.UrlDecode(reqCookies["person_name"].ToString()) + " 外出公務", "Asia/Taipei", start, end, calendarid);
            }
        }
        /// <summary>
        /// 按下 請病假 按鈕
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_sick_leave_Click(object sender, EventArgs e)
        {
            List<Button> buttons = new List<Button> { bt_outside_business, bt_sick_leave, bt_menstrual_leave, bt_personal_leave, bt_compensatory_leave, bt_specaial_leave };
            List<string> strings = new List<string> { "外出公務", "請病假", "請生理假", "請事假", "補休", "特休" };
            for (int i = 0; i < buttons.Count; i++)
            {
                buttons[i].Text = strings[i];
            }
            bt_sick_leave.Text = "🏃請病假🏃";
            cookie_by_day_state("out", bt_sick_leave);
            Response.Write("<script>alert('按了請病假按鈕');</script>");
            DateTime start = DateTime.Now;
            DateTime end = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 18:00:00");
            HttpCookie reqCookies = Request.Cookies["person"];
            if (reqCookies != null)
            {
                string calendarid = Server.UrlDecode(reqCookies["person_calendar"].ToString());
                googleCalendar.Add_new_event("test project", /*"測試 " +*/ Server.UrlDecode(reqCookies["person_name"].ToString()) + " 病假", "Asia/Taipei", start, end, calendarid);
            }
        }
        /// <summary>
        /// 按下 請生理假 按鈕
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_menstrual_leave_Click(object sender, EventArgs e)
        {
            List<Button> buttons = new List<Button> { bt_outside_business, bt_sick_leave, bt_menstrual_leave, bt_personal_leave, bt_compensatory_leave, bt_specaial_leave };
            List<string> strings = new List<string> { "外出公務", "請病假", "請生理假", "請事假", "補休", "特休" };
            for (int i = 0; i < buttons.Count; i++)
            {
                buttons[i].Text = strings[i];
            }
            bt_menstrual_leave.Text = "🏃請生理假🏃";
            cookie_by_day_state("out", bt_menstrual_leave);
            Response.Write("<script>alert('按了請生理假按鈕');</script>");
            DateTime start = DateTime.Now;
            DateTime end = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 18:00:00");
            HttpCookie reqCookies = Request.Cookies["person"];
            if (reqCookies != null)
            {
                string calendarid = Server.UrlDecode(reqCookies["person_calendar"].ToString());
                googleCalendar.Add_new_event("test project", /*"測試 " +*/ Server.UrlDecode(reqCookies["person_name"].ToString()) + " 生理假", "Asia/Taipei", start, end, calendarid);
            }
        }
        /// <summary>
        /// 按下 請事假 按鈕
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_personal_leave_Click(object sender, EventArgs e)
        {
            List<Button> buttons = new List<Button> { bt_outside_business, bt_sick_leave, bt_menstrual_leave, bt_personal_leave, bt_compensatory_leave, bt_specaial_leave };
            List<string> strings = new List<string> { "外出公務", "請病假", "請生理假", "請事假", "補休", "特休" };
            for (int i = 0; i < buttons.Count; i++)
            {
                buttons[i].Text = strings[i];
            }
            bt_personal_leave.Text = "🏃請事假🏃";
            cookie_by_day_state("out", bt_personal_leave);
            Response.Write("<script>alert('按了請事假按鈕');</script>");
            DateTime start = DateTime.Now;
            DateTime end = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 18:00:00");
            HttpCookie reqCookies = Request.Cookies["person"];
            if (reqCookies != null)
            {
                string calendarid = Server.UrlDecode(reqCookies["person_calendar"].ToString());
                googleCalendar.Add_new_event("test project", /*"測試 " +*/ Server.UrlDecode(reqCookies["person_name"].ToString()) + " 事假", "Asia/Taipei", start, end, calendarid);
            }
        }
        /// <summary>
        /// 按下 補休 按鈕
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_compensatory_leave_Click(object sender, EventArgs e)
        {
            List<Button> buttons = new List<Button> { bt_outside_business, bt_sick_leave, bt_menstrual_leave, bt_personal_leave, bt_compensatory_leave, bt_specaial_leave };
            List<string> strings = new List<string> { "外出公務", "請病假", "請生理假", "請事假", "補休", "特休" };
            for (int i = 0; i < buttons.Count; i++)
            {
                buttons[i].Text = strings[i];
            }
            bt_compensatory_leave.Text = "🏃補休🏃";
            cookie_by_day_state("out", bt_compensatory_leave);
            Response.Write("<script>alert('按了補休按鈕');</script>");
            DateTime start = DateTime.Now;
            DateTime end = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 18:00:00");
            HttpCookie reqCookies = Request.Cookies["person"];
            if (reqCookies != null)
            {
                string calendarid = Server.UrlDecode(reqCookies["person_calendar"].ToString());
                googleCalendar.Add_new_event("test project", /*"測試 " +*/ Server.UrlDecode(reqCookies["person_name"].ToString()) + " 補休", "Asia/Taipei", start, end, calendarid);
            }
        }
        /// <summary>
        /// 按下 特休 按鈕
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_specaial_leave_Click(object sender, EventArgs e)
        {
            List<Button> buttons = new List<Button> { bt_outside_business, bt_sick_leave, bt_menstrual_leave, bt_personal_leave, bt_compensatory_leave, bt_specaial_leave };
            List<string> strings = new List<string> { "外出公務", "請病假", "請生理假", "請事假", "補休", "特休" };
            for (int i = 0; i < buttons.Count; i++)
            {
                buttons[i].Text = strings[i];
            }
            bt_specaial_leave.Text = "🏃特休🏃";
            cookie_by_day_state("out", bt_specaial_leave);
            Response.Write("<script>alert('按了特休按鈕');</script>");
            DateTime start = DateTime.Now;
            DateTime end = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd") + " 18:00:00");
            HttpCookie reqCookies = Request.Cookies["person"];
            if (reqCookies != null)
            {
                string calendarid = Server.UrlDecode(reqCookies["person_calendar"].ToString());
                googleCalendar.Add_new_event("test project", /*"測試 " +*/ Server.UrlDecode(reqCookies["person_name"].ToString()) + " 特休", "Asia/Taipei", start, end, calendarid);
            }
        }
        /// <summary>
        /// 將出勤狀態 上傳至資料庫attendance.h_attendance_day
        /// </summary>
        /// <param name="user_name">同修姓名</param>
        /// <param name="attendance_state">出勤狀態/會與出勤時長欄位屬性結合 用途統計使用 出勤/請假 兩大類</param>
        /// <param name="consecutive_hours">連續小時</param>
        /// <param name="morning_light_up">晨光上</param>
        /// <param name="morning_light_down">晨光下</param>
        /// <param name="morning_meeting">晨會</param>
        protected void send_data_to_sql_byDate(string user_name, string attendance_state, double consecutive_hours = 0, int morning_light_up = 0, int morning_light_down = 0, int morning_meeting = 0)
        {
            //將資料傳遞至資料庫
            //on duplicate 完成邏輯 沒有則新增,有則更新

            string submit_sql = clsDB.MySQL_Command("INSERT INTO attendance.h_attendance_day (user_name, attendance_day, attendance_state, consecutive_hours, morning_light_up, morning_light_down, morning_meeting) VALUES ('" + user_name + "','" + DateTime.Now.ToString("yyyy/MM/dd") + "','" + attendance_state + "'," + consecutive_hours.ToString("F1") + "," + morning_light_up.ToString() + "," + morning_light_down.ToString() + "," + morning_meeting.ToString() + ")  ON DUPLICATE KEY UPDATE consecutive_hours=" + consecutive_hours.ToString("F1") + ",morning_light_up=" + morning_light_up.ToString() + ",morning_light_down=" + morning_light_down.ToString() + ",morning_meeting=" + morning_meeting.ToString() + "");
            //Response.Write(submit_sql);
            //Response.Write("INSERT INTO attendance.h_attendance_day (user_name, attendance_day, attendance_state, consecutive_hours, morning_light_up, morning_light_down, morning_meeting) VALUES ('" + user_name + "','" + DateTime.Now.ToString("yyyy/MM/dd") + "','" + attendance_state + "'," + consecutive_hours.ToString("F1") + "," + morning_light_up.ToString() + "," + morning_light_down.ToString() + "," + morning_meeting.ToString() + ")  ON DUPLICATE KEY UPDATE consecutive_hours=" + consecutive_hours.ToString("F1") + ",morning_light_up=" + morning_light_up.ToString() + ",morning_light_down=" + morning_light_down.ToString() + ",morning_meeting=" + morning_meeting.ToString() + "");
        }
        /// <summary>
        /// //將資料傳遞至資料庫
        /// </summary>
        /// <param name="user_name">同修姓名</param>
        /// <param name="attendance_state">出勤狀態  跟網頁上按鈕狀態有關  隨者按鈕 擴增而增加</param>
        /// <param name="create_time">狀態起始時間  網頁按下按鈕的時間</param>
        protected void send_data_to_sql_byTime(string user_name, string attendance_state, DateTime create_time)
        {
            //將資料傳遞至資料庫
            string submit_sql = clsDB.MySQL_Command("INSERT INTO attendance.h_attendance_infor (user_name, attendance_state, create_time) VALUES ('" + user_name + "','" + attendance_state + "','" + create_time.ToString("yyyy/MM/dd HH:mm:ss") + "')");

        }
    }
}