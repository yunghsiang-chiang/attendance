using Attendance.App_Code;
using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.Web.UI;

namespace Attendance.Auto
{
    public partial class update_person_vacation : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string taskPath = Request.Url.AbsoluteUri; // 獲取網頁執行的完整 URL
            string status = "順利執行"; // 預設狀態為順利執行

            try
            {
                if (!IsPostBack) // 確保此方法只在首次加載頁面時執行
                {
                    UpdateSpecialVacationHours(); // 更新特休時數
                }
            }
            catch (Exception ex)
            {
                // 發生異常時記錄異常資訊
                status = $"發生異常: {ex.Message}";
            }
            finally
            {
                // 無論成功或失敗都更新排程檢視表
                UpdateTaskViewTable(taskPath, status);
                ClosePage(); // 執行完後關閉網頁
            }
        }

        /// <summary>
        /// 更新員工特休時數的主要方法
        /// </summary>
        private void UpdateSpecialVacationHours()
        {
            try
            {
                clsDB db = new clsDB(); // 資料庫操作物件
                DateTime today = DateTime.Today; // 取得當天日期

                // 查詢所有員工的入職日期與目前的特休時數
                string query = "SELECT person_id, start_work, special_vacation_hours FROM r_person_vacation";
                DataTable dt = db.MySQL_Select(query); // 執行查詢並取得結果

                foreach (DataRow row in dt.Rows) // 遍歷每一筆員工資料
                {
                    // 解析員工的入職日期
                    DateTime startWorkDate = DateTime.Parse(row["start_work"].ToString());

                    // 計算服務年限
                    int yearsOfService = today.Year - startWorkDate.Year;
                    if (startWorkDate.Date > today.AddYears(-yearsOfService)) yearsOfService--; // 確保正確的服務年限計算

                    // 如果入職日期的月/日與今天的月/日相符，則更新特休時數
                    if (startWorkDate.Month == today.Month && startWorkDate.Day == today.Day)
                    {
                        int vacationDays = CalculateVacationDays(yearsOfService); // 計算應得的特休天數
                        int vacationHours = vacationDays * 8; // 將特休天數轉換為特休時數 (1 天 = 8 小時)

                        string personId = row["person_id"].ToString(); // 取得員工 ID
                        // 更新特休時數至資料庫
                        string updateQuery = $"UPDATE r_person_vacation SET special_vacation_hours = {vacationHours} WHERE person_id = '{personId}'";
                        db.MySQL_Command(updateQuery); // 執行更新語句
                    }
                }
            }
            catch (Exception ex)
            {
                // 處理例外狀況並記錄錯誤訊息
                Console.WriteLine($"更新特休時數時發生錯誤: {ex.Message}");
                throw; // 向上拋出例外
            }
        }

        /// <summary>
        /// 根據服務年限計算應得的特休天數
        /// </summary>
        /// <param name="yearsOfService">服務年限</param>
        /// <returns>應得的特休天數</returns>
        private int CalculateVacationDays(int yearsOfService)
        {
            // 根據特休規則計算特休天數
            if (yearsOfService < 0.5) return 0; // 未滿半年無特休
            if (yearsOfService < 1) return 3; // 六個月以上一年未滿
            if (yearsOfService < 2) return 7; // 一年以上二年未滿
            if (yearsOfService < 3) return 10; // 二年以上三年未滿
            if (yearsOfService < 5) return 14; // 三年以上五年未滿
            if (yearsOfService < 10) return 15; // 五年以上十年未滿
            return Math.Min(15 + (yearsOfService - 10), 30); // 十年以上，每年加一天，最高加至 30 天
        }

        /// <summary>
        /// 更新或插入排程檢視表記錄
        /// </summary>
        /// <param name="taskPath">執行的任務路徑 (URL)</param>
        /// <param name="status">執行狀態</param>
        private void UpdateTaskViewTable(string taskPath, string status)
        {
            try
            {
                // 建立資料庫連線字串
                string connectionString = "server=192.168.11.51;UId=hochi_root;Pwd=hochi_Taoyuan;database=task_schema;";
                using (MySqlConnection conn = new MySqlConnection(connectionString))
                {
                    conn.Open();

                    // 檢查是否已經有對應的記錄
                    string selectQuery = "SELECT COUNT(*) FROM r_task_python_selenium WHERE task_path = @taskPath";
                    using (MySqlCommand selectCmd = new MySqlCommand(selectQuery, conn))
                    {
                        selectCmd.Parameters.AddWithValue("@taskPath", taskPath);
                        int recordCount = Convert.ToInt32(selectCmd.ExecuteScalar()); // 查詢結果為記錄數量

                        if (recordCount > 0)
                        {
                            // 如果記錄已存在，執行更新
                            string updateQuery = @"
                        UPDATE r_task_python_selenium
                        SET lmtime = @lmtime, status = @status
                        WHERE task_path = @taskPath";
                            using (MySqlCommand updateCmd = new MySqlCommand(updateQuery, conn))
                            {
                                updateCmd.Parameters.AddWithValue("@lmtime", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                                updateCmd.Parameters.AddWithValue("@status", status);
                                updateCmd.Parameters.AddWithValue("@taskPath", taskPath);
                                updateCmd.ExecuteNonQuery();
                            }
                        }
                        else
                        {
                            // 如果記錄不存在，插入新記錄
                            string insertQuery = @"
                        INSERT INTO r_task_python_selenium (lmtime, status, task_path)
                        VALUES (@lmtime, @status, @taskPath)";
                            using (MySqlCommand insertCmd = new MySqlCommand(insertQuery, conn))
                            {
                                insertCmd.Parameters.AddWithValue("@lmtime", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                                insertCmd.Parameters.AddWithValue("@status", status);
                                insertCmd.Parameters.AddWithValue("@taskPath", taskPath);
                                insertCmd.ExecuteNonQuery();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // 如果更新或插入過程發生異常，記錄異常訊息
                Console.WriteLine($"更新或插入排程檢視表時發生異常: {ex.Message}");
            }
        }


        /// <summary>
        /// 執行完畢後關閉網頁的 JavaScript 方法
        /// </summary>
        private void ClosePage()
        {
            // 使用 ScriptManager 在網頁執行 JavaScript
            string script = "<script type='text/javascript'>window.open('', '_self').close();</script>";
            ClientScript.RegisterStartupScript(this.GetType(), "ClosePage", script);
        }
    }
}
