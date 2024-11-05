$(document).ready(function () {
    // 點擊報表按鈕
    $('#generateReport').click(function () {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();

        // 驗證日期
        if (!startDate || !endDate) {
            alert("請選擇起始日期和結束日期");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert("結束日期不可以比起始日期早");
            return;
        }

        // 生成報表
        generateReport(startDate, endDate);
    });
});

function generateReport(startDate, endDate) {
    const apiUrl = `http://internal.hochi.org.tw:8082/api/attendance/GetAttendanceSummary?startDate=${startDate}&endDate=${endDate}`;

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (data) {
            populateReportTable(data.$values);
        },
        error: function (xhr, status, error) {
            console.error("報表生成失敗:", error);
            alert("報表生成失敗，請稍後再試。");
        }
    });
}

function populateReportTable(data) {
    const tbody = $('#reportTable tbody');
    tbody.empty(); // 清空表格

    data.forEach(record => {
        const row = `
            <tr>
                <td>${record.user_id}</td>
                <td>${record.name}</td>
                <td>${record.出勤}</td>
                <td>${record.晨會}</td>
                <td>${record.晨光上}</td>
                <td>${record.晨光下}</td>
                <td>${record.病假}</td>
                <td>${record.事假}</td>
                <td>${record.特休}</td>
                <td>${record.補休}</td>
                <td>${record.加班}</td>
            </tr>
        `;
        tbody.append(row);
    });
}
