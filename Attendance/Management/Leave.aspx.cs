using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using System.Web.Services;
using MySql.Data.MySqlClient;

namespace Attendance.Management
{
    public partial class Leave : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        private static string ConnStr
        {
            get { return ConfigurationManager.ConnectionStrings["AttendanceMySql"].ConnectionString; }
        }

        // ✅ 給前端 AJAX 呼叫：Leave.aspx/UpdateAllSpecialVacationHours
        [WebMethod(EnableSession = true)]
        public static object UpdateAllSpecialVacationHours()
        {
            System.IO.File.AppendAllText(
    HttpContext.Current.Server.MapPath("~/App_Data/leave_log.txt"),
    DateTime.Now.ToString("s") + " hit UpdateAllSpecialVacationHours\r\n"
);

            // ====== 基本防護：至少要求有登入 cookie（你們目前 authentication=None）
            // 你可以再加「管理員名單」限制（下面示範）
            if (!IsAllowedAdmin())
            {
                return new { ok = false, message = "沒有權限執行批次更新。" };
            }

            int updated = 0;
            int skipped = 0;
            int total = 0;

            var today = DateTime.Today;

            using (var conn = new MySqlConnection(ConnStr))
            {
                conn.Open();

                // 1) 先取出全員（只拿需要的欄位）
                var people = new List<PersonRow>();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
SELECT person_id, start_work, special_vacation_hours
FROM r_person_vacation
WHERE person_id IS NOT NULL
  AND person_id <> ''
  AND start_work IS NOT NULL;";
                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            var pid = Convert.ToString(rd["person_id"] ?? "").Trim();
                            if (string.IsNullOrEmpty(pid)) continue;

                            DateTime startWork;
                            if (!DateTime.TryParse(Convert.ToString(rd["start_work"]), out startWork))
                                continue;

                            double oldHours = 0;
                            try { oldHours = Convert.ToDouble(rd["special_vacation_hours"] == DBNull.Value ? 0 : rd["special_vacation_hours"]); }
                            catch { oldHours = 0; }

                            people.Add(new PersonRow { PersonId = pid, StartWork = startWork.Date, OldHours = oldHours });
                        }
                    }
                }

                total = people.Count;

                // 2) 批次更新（Transaction + prepared command）
                using (var tx = conn.BeginTransaction())
                using (var cmdUp = conn.CreateCommand())
                {
                    cmdUp.Transaction = tx;
                    cmdUp.CommandText = @"
UPDATE r_person_vacation
SET special_vacation_hours = @hours
WHERE person_id = @pid;";

                    cmdUp.Parameters.Add("@hours", MySqlDbType.Double);
                    cmdUp.Parameters.Add("@pid", MySqlDbType.VarChar);

                    foreach (var p in people)
                    {
                        var newHours = CalculateSpecialVacationHours(p.StartWork, today);

                        // 若不想每次都寫入，可用差異判斷
                        if (Math.Abs(newHours - p.OldHours) < 0.01)
                        {
                            skipped++;
                            continue;
                        }

                        cmdUp.Parameters["@hours"].Value = newHours;
                        cmdUp.Parameters["@pid"].Value = p.PersonId;

                        cmdUp.ExecuteNonQuery();
                        updated++;
                    }

                    tx.Commit();
                }
            }

            return new
            {
                ok = true,
                message = "批次更新完成",
                total = total,
                updated = updated,
                skipped = skipped,
                today = today.ToString("yyyy-MM-dd")
            };
        }

        // ====== 年資 -> 特休時數（1天=8小時）
        private static double CalculateSpecialVacationHours(DateTime startWork, DateTime today)
        {
            if (today < startWork) return 0;

            // 已完成幾次週年（滿幾年）
            int completedYears = today.Year - startWork.Year;
            if (startWork.AddYears(completedYears) > today) completedYears--;

            int days = 0;

            if (completedYears <= 0)
            {
                // 未滿 1 年：滿 6 個月 3 天；未滿 6 個月 0 天
                days = (startWork.AddMonths(6) <= today) ? 3 : 0;
            }
            else if (completedYears == 1) days = 7;
            else if (completedYears == 2) days = 10;
            else if (completedYears == 3 || completedYears == 4) days = 14;
            else if (completedYears >= 5 && completedYears <= 9) days = 15;
            else
            {
                // 10年以上：每年 +1 天，上限 30 天
                days = 15 + (completedYears - 9); // 10年=16天
                if (days > 30) days = 30;
            }

            return days * 8.0;
        }

        // ====== 權限檢查：你可以用「管理員 ID 白名單」
        private static bool IsAllowedAdmin()
        {
            // 1) 至少要有登入 cookie
            var ctx = HttpContext.Current;
            if (ctx == null) return false;

            var c = ctx.Request.Cookies["person"];
            var pid = (c != null) ? ctx.Server.UrlDecode(c["person_id"]) : "";
            pid = (pid ?? "").Trim();
            if (string.IsNullOrEmpty(pid)) return false;

            // 2) 管理員白名單（建議你自己填）
            // Web.config appSettings: <add key="LeaveAdminIds" value="9381,14081" />
            var allow = ConfigurationManager.AppSettings["LeaveAdminIds"];
            if (string.IsNullOrEmpty(allow))
            {
                // 沒設定就放行（不建議，但避免你卡住）
                return true;
            }

            var parts = allow.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var x in parts)
            {
                if (x.Trim() == pid) return true;
            }
            return false;
        }

        private class PersonRow
        {
            public string PersonId;
            public DateTime StartWork;
            public double OldHours;
        }
    }
}
