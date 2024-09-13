$(document).ready(function () {
    // 初始化當前日期
    let currentDate = new Date();

    // 更新年月顯示
    function updateMonthLabel() {
        const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        $("#currentMonthLabel").text(`${year}年 ${monthNames[month]}`);
    }

    // 上個月按鈕點擊事件
    $("#prevMonthBtn").on("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthLabel();
    });

    // 下個月按鈕點擊事件
    $("#nextMonthBtn").on("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthLabel();
    });

    //顯示圖表
    function showchart() {
        // 模擬 API 獲取的資料
        const workingDays = [
            "2024-9-2", "2024-9-3", "2024-9-4", "2024-9-5", "2024-9-6", "2024-9-9",
            "2024-9-10", "2024-9-11", "2024-9-12", "2024-9-13", "2024-9-16",
            "2024-9-18", "2024-9-19", "2024-9-20", "2024-9-23", "2024-9-24",
            "2024-9-25", "2024-9-26", "2024-9-27", "2024-9-30"
        ];

        const currentDate = "2024-9-13"; // 當前日期

        // 員工的出勤情況 (透過 API 獲得)
        const employeeA = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const employeeB = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const employeeC = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        const ctx = document.getElementById('attendanceChart').getContext('2d');

        const attendanceChart = new Chart(ctx, {
            type: 'bar', // 堆疊直條圖 + 折線圖
            data: {
                labels: workingDays,
                datasets: [
                    {
                        type: 'line',
                        label: '應到人數',
                        data: workingDays.map((day, index) => index < 10 ? 3 : 0), // 模擬資料：9月13日之前應到3人
                        borderColor: 'blue',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: '員工A報到',
                        data: employeeA,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        stack: 'Stack 0'
                    },
                    {
                        label: '員工B報到',
                        data: employeeB,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        stack: 'Stack 0'
                    },
                    {
                        label: '員工C報到',
                        data: employeeC,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        stack: 'Stack 0'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true // X 軸允許堆疊
                    },
                    y: {
                        stacked: true, // Y 軸允許堆疊
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // 初始化顯示當前的年月
    updateMonthLabel();
    //顯示圖表
    showchart();

});