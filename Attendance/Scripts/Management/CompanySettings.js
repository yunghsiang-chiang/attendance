$(document).ready(async function () {
    // 透過 fetch 取得 API 資料
    async function fetchAttendanceTimes() {
        try {
            const response = await fetch('http://internal.hochi.org.tw:8082/api/attendance/getAllAttendanceTimes');
            const data = await response.json();

            // 呼叫顯示資料的函數
            displayAttendanceTimes(data);
        } catch (error) {
            console.error('Error fetching attendance times:', error);
        }
    }

    // 顯示工作時間和午休時間的函數
    function displayAttendanceTimes(data) {
        const attendanceContainer = document.getElementById('attendance-times');
        attendanceContainer.innerHTML = ''; // 清空現有內容

        // 遍歷每個出勤資料並顯示
        data.forEach(item => {
            const attendanceItem = document.createElement('div');
            attendanceItem.classList.add('attendance-item');

            attendanceItem.innerHTML = `
            <div><span class="time-label">上班時間:</span> <input type="time" id="workStart_${item.id}" value="${item.work_start_time.slice(0, 5)}"></div>
            <div><span class="time-label">下班時間:</span> <input type="time" id="workEnd_${item.id}" value="${item.work_end_time.slice(0, 5)}"></div>
            <br><br>
            <div><span class="time-label">午休開始:</span> <input type="time" id="lunchStart_${item.id}" value="${item.lunch_start_time.slice(0, 5)}"></div>
            <div><span class="time-label">午休結束:</span> <input type="time" id="lunchEnd_${item.id}" value="${item.lunch_end_time.slice(0, 5)}"></div>
            <input type='button' onclick="updateAttendanceTimes()" value="更新出勤時間" />
        `;

            attendanceContainer.appendChild(attendanceItem);
        });
    }




    // 調用函數以取得並顯示出勤時間
    fetchAttendanceTimes();
})

// 更新出勤時間的函數
async function updateAttendanceTimes() {
    const id = 1; //固定1，除非後續出勤時間有其他設定值，後續再考慮
    const workStart = document.getElementById(`workStart_${id}`).value+':00';
    const workEnd = document.getElementById(`workEnd_${id}`).value + ':00';
    const lunchStart = document.getElementById(`lunchStart_${id}`).value + ':00';
    const lunchEnd = document.getElementById(`lunchEnd_${id}`).value + ':00';

    const payload = {
        work_start_time: workStart,
        work_end_time: workEnd,
        lunch_start_time: lunchStart,
        lunch_end_time: lunchEnd
    };
    try {
        const response = await fetch(`http://internal.hochi.org.tw:8082/api/attendance/UpdateAttendanceTimes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('工作時間已成功更新');
        } else {
            alert('更新失敗');
        }
    } catch (error) {
        console.error('Error updating work times:', error);
    }
}