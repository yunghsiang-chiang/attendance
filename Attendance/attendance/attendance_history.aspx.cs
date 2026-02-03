using System;
using System.Configuration;
using System.Web;
using MySql.Data.MySqlClient;

namespace Attendance.attendance
{
    public partial class attendance_history : System.Web.UI.Page
    {
        private string ConnStr
        {
            get
            {
                return ConfigurationManager.ConnectionStrings["AttendanceMySql"].ConnectionString;
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack) return;

            // 依你前端 hidden 的來源：cookie["person"]["person_id"]
            var personCookie = Request.Cookies["person"];
            var personId = (personCookie != null) ? Server.UrlDecode(personCookie["person_id"]) : "";
            personId = (personId ?? "").Trim();

            if (string.IsNullOrEmpty(personId)) return; // 未登入就不更新

            try
            {
                UpdateSpecialVacationHours(personId, DateTime.Today);
            }
            catch
            {
                // 你們若有內部 log 機制可加；這邊不要 Response.Write 以免破壞頁面
                // throw; // 若你希望直接看到錯誤可暫時打開
            }
        }

        private void UpdateSpecialVacationHours(string personId, DateTime today)
        {
            DateTime? startWork = GetStartWorkDate(personId);
            if (!startWork.HasValue) return;

            double hours = CalculateSpecialVacationHours(startWork.Value.Date, today.Date);

            // 若你希望「0 小時也要回寫」，保留即可；若不想覆寫已有值，可加判斷 hours>0
            ExecuteUpdateSpecialHours(personId, hours);
        }

        private DateTime? GetStartWorkDate(string personId)
        {
            using (var conn = new MySqlConnection(ConnStr))
            using (var cmd = conn.CreateCommand())
            {
                conn.Open();
                cmd.CommandText = @"
SELECT start_work
FROM r_person_vacation
WHERE person_id = @pid
LIMIT 1;";
                cmd.Parameters.AddWithValue("@pid", personId);

                object obj = cmd.ExecuteScalar();
                if (obj == null || obj == DBNull.Value) return null;

                // start_work 是 DATE，通常可直接轉 DateTime
                DateTime dt;
                if (DateTime.TryParse(Convert.ToString(obj), out dt))
                    return dt.Date;

                return null;
            }
        }

        // 核心：依到職日與今天，算「目前這個特休年度」應得特休（小時）
        // 規則：1天=8小時
        private double CalculateSpecialVacationHours(DateTime startWork, DateTime today)
        {
            if (today < startWork) return 0;

            // 計算已滿「整年」年資（完成幾次到職週年）
            int completedYears = today.Year - startWork.Year;
            if (startWork.AddYears(completedYears) > today) completedYears--;

            int days = 0;

            if (completedYears <= 0)
            {
                // 未滿 1 年：滿 6 個月 3 天，未滿 6 個月 0 天
                if (startWork.AddMonths(6) <= today) days = 3;
                else days = 0;
            }
            else if (completedYears == 1)
            {
                days = 7;
            }
            else if (completedYears == 2)
            {
                days = 10;
            }
            else if (completedYears == 3 || completedYears == 4)
            {
                days = 14;
            }
            else if (completedYears >= 5 && completedYears <= 9)
            {
                days = 15;
            }
            else // completedYears >= 10
            {
                // 10年以上：每 1 年加 1 天，上限 30 天
                // 10年=16天、11年=17天...
                days = 15 + (completedYears - 9);
                if (days > 30) days = 30;
            }

            return days * 8.0; // 一天 8 小時
        }

        private void ExecuteUpdateSpecialHours(string personId, double hours)
        {
            using (var conn = new MySqlConnection(ConnStr))
            using (var cmd = conn.CreateCommand())
            {
                conn.Open();
                cmd.CommandText = @"
UPDATE r_person_vacation
SET special_vacation_hours = @hours
WHERE person_id = @pid;";
                cmd.Parameters.AddWithValue("@hours", hours);
                cmd.Parameters.AddWithValue("@pid", personId);
                cmd.ExecuteNonQuery();
            }
        }
    }
}
