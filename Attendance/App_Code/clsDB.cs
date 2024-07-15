using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using System.Data.SqlClient;
using MySql.Data;
using System.Web.Configuration;
using System.Data;
using System.Configuration;
using System.Globalization;
using System.ComponentModel;

namespace Attendance.App_Code
{
    public class clsDB
    {
        /// <summary>
        /// Sql server "Delect" sql command 使用 
        /// </summary>
        /// <param name="SQLCommand">Sql command</param>
        /// <param name="ConnectionString">connect information from web.config</param>
        public void SQL_DELETE(string SQLCommand, string ConnectionString)
        {
            using (SqlConnection conn = new SqlConnection(WebConfigurationManager.ConnectionStrings[ConnectionString].ConnectionString))
            {
                SqlCommand cmd = new SqlCommand(SQLCommand, conn);
                conn.Open();
                cmd.ExecuteNonQuery();
                cmd.Cancel();
                cmd.Dispose();
            }
        }
        /// <summary>
        /// Sql server "Insert" sql command 使用 
        /// </summary>
        /// <param name="SQLCommand">Sql command</param>
        /// <param name="ConnectionString">connect information from web.config</param>
        /// <returns></returns>
        public string SQL_Insert(string SQLCommand, string ConnectionString)
        {
            string strReturn = "finish";
            using (SqlConnection conn = new SqlConnection(WebConfigurationManager.ConnectionStrings[ConnectionString].ConnectionString))
            {
                SqlCommand cmd = new SqlCommand(SQLCommand, conn);
                conn.Open();
                try { cmd.ExecuteNonQuery(); }
                catch (Exception ex)
                {
                    strReturn += ex.ToString();
                }
                cmd.Cancel();
                cmd.Dispose();
                SqlConnection.ClearAllPools();
                return strReturn;
            }
        }
        /// <summary>
        /// 回傳 布林值 資料表是否有符合條件資料
        /// </summary>
        /// <param name="SQLCommand">Sql command</param>
        /// <param name="ConnectionString">connect information from web.config</param>
        /// <returns></returns>
        public bool SQL_HasRows(string SQLCommand, string ConnectionString)
        {
            bool has_Row = false;
            using (SqlConnection conn = new SqlConnection(WebConfigurationManager.ConnectionStrings[ConnectionString].ConnectionString))
            {
                SqlCommand cmd = new SqlCommand(SQLCommand, conn);
                conn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                has_Row = dr.HasRows;
                cmd.Cancel();
                dr.Close();
                SqlConnection.ClearAllPools();
            }
            return has_Row;
        }
        /// <summary>
        /// 回傳 布林值 資料表是否有符合條件資料
        /// </summary>
        /// <param name="SQLCommand">Sql command</param>
        /// <param name="ConnectionString">connect information from web.config</param>
        /// <param name="table">ref DataTable</param>
        /// <returns></returns>
        public bool SQL_HasRows_Table(string SQLCommand, string ConnectionString, ref DataTable table)
        {
            bool has_Row = false;
            using (SqlConnection conn = new SqlConnection(WebConfigurationManager.ConnectionStrings[ConnectionString].ConnectionString))
            {
                SqlCommand cmd = new SqlCommand(SQLCommand, conn);
                conn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                has_Row = dr.HasRows;
                table.Load(dr);
                cmd.Cancel();
                dr.Close();
                SqlConnection.ClearAllPools();
            }
            return has_Row;
        }
        /// <summary>
        /// Sql server "Select" sql command 使用 
        /// </summary>
        /// <param name="SQLCommand">Sql command</param>
        /// <param name="ConnectionString">connect information from web.config</param>
        /// <returns></returns>
        public DataTable SQL_Select(string SQLCommand, string ConnectionString)
        {
            DataTable table = new DataTable();
            using (SqlConnection conn = new SqlConnection(WebConfigurationManager.ConnectionStrings[ConnectionString].ConnectionString))
            {
                SqlCommand cmd = new SqlCommand(SQLCommand, conn);
                conn.Open();
                cmd.CommandTimeout = 3600;
                SqlDataReader dr = cmd.ExecuteReader();
                table.Load(dr);
                cmd.Cancel();
                dr.Close();
                SqlConnection.ClearAllPools();
            }
            return table;
        }
        /// <summary>
        /// Big data 批次匯入sql server
        /// </summary>
        /// <param name="table">insert into 的 DataTable</param>
        /// <param name="ConnectionString">connect information from web.config</param>
        /// <param name="dbo">sql servcer schema 名稱</param>
        /// <param name="strBC">schema datatable 的 columns name list</param>
        /// <param name="strSouse">insert DataTable 的 columns name list</param>
        /// <returns></returns>
        public string SQL_SqlBulkCopy(DataTable table, string ConnectionString, string dbo, string[] strBC, string[] strSouse)//目的地/資料源
        {
            string strReturn = "finish";
            GregorianCalendar gc = new GregorianCalendar();
            SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings[ConnectionString].ConnectionString);
            conn.Open();
            using (SqlBulkCopy sqlBC = new SqlBulkCopy(conn))
            {
                sqlBC.BatchSize = 1000; //設定一個批次量寫入多少筆資料
                sqlBC.BulkCopyTimeout = 60;//設定逾時的秒數
                sqlBC.DestinationTableName = dbo;//DataTable名稱
                try
                {
                    for (int i = 0; i < strBC.Length; i++)
                    {
                        sqlBC.ColumnMappings.Add(strSouse[i], strBC[i]);//對應資料行(資料源/目的地)
                    }
                    sqlBC.WriteToServer(table);//開始寫入
                }
                catch (Exception ex)
                {
                    strReturn += ex.ToString();
                }
            }
            conn.Dispose();
            return strReturn;
        }
        /// <summary>
        /// Mysql "Select"
        /// </summary>
        /// <param name="SQLCommand">sql command</param>
        /// <returns></returns>
        public DataTable MySQL_Select(string SQLCommand)
        {
            DataTable table = new DataTable();
            String cs = "server=192.168.11.51;UId=hochi_root; Pwd =hochi_Taoyuan;database=attendance;maximumpoolsize=150";
            MySqlConnection conn = new MySqlConnection(cs);
            MySqlDataAdapter da = new MySqlDataAdapter();
            da.SelectCommand = new MySqlCommand(SQLCommand, conn);
            da.SelectCommand.CommandTimeout = 0;
            da.Fill(table);
            conn.Close();
            conn.Dispose();
            return table;
        }
        /// <summary>
        /// Mysql "Update/Insert/Delect"
        /// </summary>
        /// <param name="SQLCommand">sql command</param>
        /// <returns></returns>
        public string MySQL_Command(string SQLCommand)
        {
            string strReturn = "finish";
            String cs = "server=192.168.11.51;UId=hochi_root; Pwd =hochi_Taoyuan;database=attendance;maximumpoolsize=150";
            MySqlConnection conn = new MySqlConnection(cs);
            try
            {
                MySqlCommand command = conn.CreateCommand();
                conn.Open();
                command.CommandText = SQLCommand;
                command.ExecuteNonQuery();
                Console.ReadLine();
            }
            catch (Exception ex)
            {
                strReturn = ex.ToString();
            }
            finally
            {
                conn.Close();
                conn.Dispose();
            }
            return strReturn;
        }
        /// <summary>
        /// Linq to DataTable
        /// </summary>
        /// <typeparam name="T">資料類型</typeparam>
        /// <param name="data">Linq toList()</param>
        /// <returns></returns>
        public DataTable ToDataTable<T>(IList<T> data)
        {
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            foreach (PropertyDescriptor prop in properties)
                table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            foreach (T item in data)
            {
                DataRow row = table.NewRow();
                foreach (PropertyDescriptor prop in properties)
                    row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                table.Rows.Add(row);
            }
            return table;
        }
        /// <summary>
        /// 回傳 日期格式對應的 週別
        /// </summary>
        /// <param name="strDate"></param>
        /// <returns></returns>
        public string GetWeekOfYear(string strDate)
        {
            DateTime dTime = Convert.ToDateTime(strDate);// DateTime.Now;
            GregorianCalendar gc = new GregorianCalendar();
            return gc.GetWeekOfYear(dTime, CalendarWeekRule.FirstDay, DayOfWeek.Monday).ToString();
        }
        /// <summary>
        /// 取得IP資訊,用於判斷 client 使用
        /// </summary>
        /// <returns></returns>
        public string GetIPAddress()//抓IP
        {
            System.Web.HttpContext context = System.Web.HttpContext.Current;
            string ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (!string.IsNullOrEmpty(ipAddress))
            {
                string[] addresses = ipAddress.Split(',');
                if (addresses.Length != 0)
                {
                    return addresses[0];
                }
            }
            return context.Request.ServerVariables["REMOTE_ADDR"];
        }

        /// <summary>
        /// 回傳 DataTable 欄列 轉置
        /// </summary>
        /// <param name="vaule">原本的DataTable</param>
        /// <returns></returns>
        public static DataTable TransposeToDataTable(DataTable vaule)
        {
            DataTable dt = vaule;
            DataTable NewDataTale = new DataTable();
            //原本DataTable列數
            int dtRowsCount = dt.Rows.Count;
            //原本DataTable欄數
            int dtColumnCount = dt.Columns.Count;
            //將原本DataTable的第一個欄位放入轉置後的第一欄
            NewDataTale.Columns.Add(dt.Columns[0].ToString(), typeof(string));
            //將原本DataTable的第一列轉置為轉置後的欄位
            for (int i = 0; i < dtRowsCount; i++)
            {
                NewDataTale.Columns.Add(dt.Rows[i][0].ToString(), typeof(string));
            }
            //將原本DataTable的欄位列依序轉置為轉置後的每一列
            //起始為0，因為原本第一列已經放置為欄位名稱，要從第二列開始跑起
            for (int s = 1; s < dtColumnCount; s++)
            {
                DataRow dr = NewDataTale.NewRow();
                dr[0] = dt.Columns[s].ToString();
                for (int i = 0; i < dtRowsCount; i++)
                {
                    dr[i + 1] = dt.Rows[i][s].ToString();
                }
                NewDataTale.Rows.Add(dr);
            }
            return NewDataTale;
        }
    }

}