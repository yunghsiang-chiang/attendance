$(document).ready(function () {
    // 獲取加班申請數據
    fetch('http://internal.hochi.org.tw:8082/api/attendance/waiting_for_approval_of_overtime_record')
        .then(response => {
            if (!response.ok) {
                throw new Error('網絡響應不正常'); // 若響應失敗，拋出錯誤
            }
            return response.json(); // 解析為 JSON
        })
        .then(data => {
            const overtimeApplyDiv = $('.overtime_apply'); // 選取加班申請的 div
            let overtimeContent = `
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>申請人</th>
                            <th>加班類型</th>
                            <th>開始時間</th>
                            <th>結束時間</th>
                            <th>總時數</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>`;

            // 遍歷加班數據並動態生成表格內容
            data.forEach(record => {
                overtimeContent += `<tr data-remark="${record.remark || ''}">
                    <td>${record.userID}</td>
                    <td>${record.userName}</td>
                    <td>${record.overtimeType}</td>
                    <td>${formatDateTime(record.startTime)}</td>
                    <td>${formatDateTime(record.endTime)}</td>
                    <td>${record.count_hours} 小時</td>
                    <td><button class="update-overtime" data-userid="${record.userID}" data-username="${record.userName}" data-overtimetype="${record.overtimeType}" data-starttime="${record.startTime}">簽核</button></td>
                </tr>`;
            });

            overtimeContent += '</tbody></table>';
            overtimeApplyDiv.append(overtimeContent); // 將內容添加到加班申請 div 中

            // 使用事件代理綁定滑鼠事件
            $('.overtime_apply').on('mouseenter', 'tr', function (e) {
                const remark = $(this).data('remark'); // 取得備註內容
                if (remark) {
                    // 顯示備註內容
                    const tooltip = $('<div class="remark-tooltip"></div>').text(`備註: ${remark}`);
                    $('body').append(tooltip); // 動態添加提示框
                    tooltip.show().css({
                        top: e.pageY + 10 + 'px', // 滑鼠位置的下方
                        left: e.pageX + 10 + 'px' // 滑鼠位置的右方
                    });
                }
            }).on('mousemove', 'tr', function (e) {
                $('.remark-tooltip').css({
                    top: e.pageY + 10 + 'px', // 更新滑鼠位置
                    left: e.pageX + 10 + 'px'
                });
            }).on('mouseleave', 'tr', function () {
                $('.remark-tooltip').remove(); // 滑鼠移開時移除提示框
            });

            // 為每個簽核按鈕綁定點擊事件
            $('.update-overtime').on('click', async function () {
                const userID = $(this).data('userid');
                const overtimeType = $(this).data('overtimetype');
                const startTime = $(this).data('starttime');
                const userName = $(this).data('username');

                await updateOvertimeRecord(userID, userName, overtimeType, startTime);
                alert('加班記錄更新成功！');
            });
        })
        .catch(error => {
            console.error('獲取加班數據時出錯:', error); // 捕獲錯誤
        });

    // 獲取請假申請數據
    fetch('http://internal.hochi.org.tw:8082/api/attendance/waiting_for_approval_of_leave_record')
        .then(response => {
            if (!response.ok) {
                throw new Error('網絡響應不正常'); // 若響應失敗，拋出錯誤
            }
            return response.json(); // 解析為 JSON
        })
        .then(data => {
            const afterApplyDiv = $('.after_apply'); // 選取事後申請的 div
            let leaveContent = `
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>申請人</th>
                            <th>請假類型</th>
                            <th>開始時間</th>
                            <th>結束時間</th>
                            <th>總時數</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>`;

            // 遍歷請假數據並動態生成表格內容
            data.forEach(record => {
                leaveContent += `<tr>
                    <td>${record.userId}</td>
                    <td>${record.userName}</td>
                    <td>${record.leaveType}</td>
                    <td>${formatDateTime(record.startTime)}</td>
                    <td>${formatDateTime(record.endTime)}</td>
                    <td>${record.count_hours} 小時</td>
                    <td><button class="update-leave" data-userid="${record.userId}" data-username="${record.userName}" data-leavetype="${record.leaveType}" data-starttime="${record.startTime}">簽核</button></td>
                </tr>`;
            });

            leaveContent += '</tbody></table>';
            afterApplyDiv.append(leaveContent); // 將內容添加到事後申請 div 中

            // 為每個簽核按鈕綁定點擊事件
            $('.update-leave').on('click', async function () {
                const userId = $(this).data('userid');
                const leaveType = $(this).data('leavetype');
                const startTime = $(this).data('starttime');
                const userName = $(this).data('username');

                await updateLeaveRecord(userId, userName, leaveType, startTime);
                alert('請假記錄更新成功！');
            });
        })
        .catch(error => {
            console.error('獲取請假數據時出錯:', error); // 捕獲錯誤
        });
});

// 格式化日期和時間的函數
function formatDateTime(dateTime) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 使用 24 小時制
    };
    return new Date(dateTime).toLocaleString('sv-SE', options); // 將日期格式化為 yyyy-mm-dd hh:mm
}

// 更新加班記錄的函數
async function updateOvertimeRecord(userID, userName, overtimeType, startTime) {
    // 從 cookie 中獲取 person_id
    const person_id = await getCookie('person_id'); // 從 cookie 取得的 person_id

    // 構建要提交的資料
    const requestData = {
        userId: userID,
        userName: userName,
        overtimeType: overtimeType, // overtimeType 對應 leaveType
        startTime: startTime,
        approved_by: person_id
    };

    fetch(`http://internal.hochi.org.tw:8082/api/attendance/update-overtime/${userID}/${overtimeType}/${startTime}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // 將資料轉換為 JSON 字符串後提交
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('更新加班記錄時出錯'); // 若響應失敗，拋出錯誤
            }
            return response.json();
        })
        .then(data => {
            console.log('加班記錄更新成功:', data); // 成功訊息
            alert('加班記錄更新成功！');
        })
        .catch(error => {
            console.error('更新加班記錄時出錯:', error); // 捕獲錯誤
        });
}

// 更新請假記錄的函數
async function updateLeaveRecord(userId, userName, leaveType, startTime) {
    // 從 cookie 中獲取 person_id
    const person_id = await getCookie('person_id'); // 從 cookie 取得的 person_id

    // 構建要提交的資料
    const requestData = {
        userID: userId,
        userName: userName,
        leaveType: leaveType, // leaveType 對應請假類型
        startTime: startTime,
        approved_by: person_id
    };

    console.log("傳送資料：", requestData);
    console.log("URL：", `http://internal.hochi.org.tw:8082/api/attendance/update-leave/${userId}/${leaveType}/${startTime}`);


    fetch(`http://internal.hochi.org.tw:8082/api/attendance/update-leave/${userId}/${leaveType}/${startTime}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // 將資料轉換為 JSON 字符串後提交
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('更新請假記錄時出錯'); // 若響應失敗，拋出錯誤
            }
            return response.json();
        })
        .then(data => {
            console.log('請假記錄更新成功:', data); // 成功訊息
            alert('請假記錄更新成功！');
        })
        .catch(error => {
            console.error('更新請假記錄時出錯:', error); // 捕獲錯誤
        });
}

// 取得 cookie 值的函數
async function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie); // 解碼 cookie
    let ca = decodedCookie.split(/&|;/); // 以 & 或 ; 分割
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length); // 回傳 cookie 值
        }
    }
    return '';
}
