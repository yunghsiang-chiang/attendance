using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.IO;
using System.Linq;
using System.Web;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;

namespace Attendance.App_Code
{
    public class googleCalendar
    {
        public void Add_new_event(string applicationName, string summary, string timeZone, DateTime Start, DateTime End, string calendarId = "c_8fcf9c9ff58fb115dae7a0293eaf68979062fdaf18c60d6f2296203cc646921a@group.calendar.google.com")
        {
            const string jsonFile = "essential-oasis-424001-j0-f283832a0ef0.json";
            //永祥            c_0ebeaa9925b0a5ae899a2416a6f5dec008a6a88cdd4d86e6c0ffbd214dad6d07@group.calendar.google.com
            //和氣大愛出勤    c_8fcf9c9ff58fb115dae7a0293eaf68979062fdaf18c60d6f2296203cc646921a@group.calendar.google.com
            //calendarId = "c_8fcf9c9ff58fb115dae7a0293eaf68979062fdaf18c60d6f2296203cc646921a@group.calendar.google.com";
            GoogleCredential credential;
            using (var stream = new FileStream(jsonFile, FileMode.Open, FileAccess.Read))
            {
                credential = GoogleCredential.FromStream(stream).CreateScoped(CalendarService.Scope.Calendar);

                var service = new CalendarService(new BaseClientService.Initializer
                {
                    HttpClientInitializer = credential,
                    ApplicationName = applicationName,
                    //ApplicationName = "test project",
                });
                var newEvent = new Event()
                {
                    Id = Guid.NewGuid().ToString().Replace("-", ""),
                    Summary = summary,
                    //Summary = "永祥 測試日曆API)",
                    Start = new EventDateTime()
                    {
                        DateTime = new DateTime(Start.Year, Start.Month, Start.Day, Start.Hour, Start.Minute, Start.Second),
                        TimeZone = timeZone
                        //TimeZone = "Asia/Taipei"
                    },
                    End = new EventDateTime()
                    {
                        DateTime = new DateTime(End.Year, End.Month, End.Day, End.Hour, End.Minute, End.Second),
                        TimeZone = timeZone
                        //TimeZone = "Asia/Taipei"
                    }
                };
                var insert = service.Events.Insert(newEvent, calendarId).Execute();
            };

        }



    }
}