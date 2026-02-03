using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using MySql.Data.MySqlClient;

namespace Attendance.Management
{
    /// <summary>
    /// UpdateSpecialVacationAll 的摘要描述
    /// </summary>
    public class UpdateSpecialVacationAll : IHttpHandler
    {
        private static string ConnStr =>
            ConfigurationManager.ConnectionStrings["AttendanceMySql"].ConnectionString;

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json; charset=utf-8";

            // ✅ 先寫 log，確認 IIS Express 有沒有進 handler
            try
            {
                System.IO.File.AppendAllText(
                    context.Server.MapPath("~/App_Data/leave_log.txt"),
                    DateTime.Now.ToString("s") + " hit ashx\r\n"
                );
            }
            catch { }

            // ✅ cookie 檢查（依你們現況）
            var c = context.Request.Cookies["person"];
            var pid = (c != null) ? context.Server.UrlDecode(c["person_id"]) : "";
            pid = (pid ?? "").Trim();

            if (string.IsNullOrEmpty(pid))
            {
                context.Response.StatusCode = 401;
                context.Response.Write("{\"ok\":false,\"message\":\"未登入\"}");
                return;
            }

            int updated = 0, skipped = 0, total = 0;
            var today = DateTime.Today;

            using (var conn = new MySqlConnection(ConnStr))
            {
                conn.Open();

                var people = new List<PersonRow>();

                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
SELECT person_id, start_work, special_vacation_hours
FROM r_person_vacation
WHERE person_id IS NOT NULL AND person_id <> '' AND start_work IS NOT NULL;";

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            var id = Convert.ToString(rd["person_id"] ?? "").Trim();
                            if (string.IsNullOrEmpty(id)) continue;

                            DateTime startWork;
                            if (!DateTime.TryParse(Convert.ToString(rd["start_work"]), out startWork)) continue;

                            double oldHours = 0;
                            try
                            {
                                oldHours = Convert.ToDouble(rd["special_vacation_hours"] == DBNull.Value ? 0 : rd["special_vacation_hours"]);
                            }
                            catch { oldHours = 0; }

                            people.Add(new PersonRow { PersonId = id, StartWork = startWork.Date, OldHours = oldHours });
                        }
                    }
                }

                total = people.Count;

                using (var tx = conn.BeginTransaction())
                using (var up = conn.CreateCommand())
                {
                    up.Transaction = tx;
                    up.CommandText = @"UPDATE r_person_vacation SET special_vacation_hours=@h WHERE person_id=@id;";
                    up.Parameters.Add("@h", MySqlDbType.Double);
                    up.Parameters.Add("@id", MySqlDbType.VarChar);

                    foreach (var p in people)
                    {
                        var newHours = Calc(p.StartWork, today);

                        if (Math.Abs(newHours - p.OldHours) < 0.01)
                        {
                            skipped++;
                            continue;
                        }

                        up.Parameters["@h"].Value = newHours;
                        up.Parameters["@id"].Value = p.PersonId;
                        up.ExecuteNonQuery();
                        updated++;
                    }

                    tx.Commit();
                }
            }

            context.Response.Write(
                "{\"ok\":true,\"total\":" + total +
                ",\"updated\":" + updated +
                ",\"skipped\":" + skipped +
                ",\"today\":\"" + today.ToString("yyyy-MM-dd") + "\"}"
            );
        }

        private static double Calc(DateTime startWork, DateTime today)
        {
            if (today < startWork) return 0;

            int years = today.Year - startWork.Year;
            if (startWork.AddYears(years) > today) years--;

            int days = 0;
            if (years <= 0) days = (startWork.AddMonths(6) <= today) ? 3 : 0;
            else if (years == 1) days = 7;
            else if (years == 2) days = 10;
            else if (years == 3 || years == 4) days = 14;
            else if (years >= 5 && years <= 9) days = 15;
            else
            {
                days = 15 + (years - 9);
                if (days > 30) days = 30;
            }

            return days * 8.0;
        }

        public bool IsReusable { get { return false; } }

        private class PersonRow
        {
            public string PersonId;
            public DateTime StartWork;
            public double OldHours;
        }
    }
}