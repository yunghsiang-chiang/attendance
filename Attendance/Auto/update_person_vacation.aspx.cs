using Attendance.App_Code;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Attendance.Auto
{
    public partial class update_person_vacation : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack) // 確保此方法只在首次加載頁面時執行
            {
                UpdateSpecialVacationHours(); // 更新特休時數
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
