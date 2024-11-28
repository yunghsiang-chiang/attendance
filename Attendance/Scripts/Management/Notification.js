$(document).ready(function () {
    let editor;

    // 初始化 CKEditor
    async function initializeEditor() {
        try {
            editor = await ClassicEditor.create(document.querySelector('#content'), {
                ckfinder: { uploadUrl: 'http://internal.hochi.org.tw:8081/api/FileUpload/UploadFiles' }
            });
        } catch (error) {
            console.error('CKEditor 初始化失敗:', error);
        }
    }

    // 儲存公告
    async function saveAnnouncement() {
        const title = $('#title').val();
        const author = $('#author').val();
        const issueTime = $('#issue_time').val();
        const startTime = $('#start_time').val();
        const endTime = $('#end_time').val();
        const status = $('#status').val();
        const content = editor.getData();

        // 檢查必填欄位
        if (!title || !author || !issueTime || !startTime || !endTime || !status || !content) {
            alert("請完整填寫所有欄位");
            return;
        }

        // 構建 API 請求數據
        const announcementData = {
            announcement_id: null, // 後端自動生成 ID
            title: title,
            content: content,
            author: author,
            issue_time: new Date(issueTime).toISOString(),
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            status: status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        try {
            const response = await fetch('http://internal.hochi.org.tw:8082/api/attendance/AddAnnouncement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(announcementData)
            });

            if (response.ok) {
                alert('公告儲存成功');
                loadNotifications(); // 重新加載公告清單
            } else {
                const errorText = await response.text();
                alert('儲存失敗: ' + errorText);
            }
        } catch (error) {
            console.error('儲存過程中出錯:', error);
            alert('發生錯誤，無法儲存公告');
        }
    }

    // 加載公告清單
    async function loadNotifications() {
        try {
            const response = await fetch('/api/get_notifications');
            if (!response.ok) throw new Error('加載公告清單失敗');

            const notifications = await response.json();
            $('#notificationList').empty();
            notifications.forEach(notification => {
                $('#notificationList').append(`<li class="list-group-item">${notification.title}</li>`);
            });
        } catch (error) {
            console.error('公告清單加載錯誤:', error);
        }
    }

    // 綁定事件
    $('#saveButton').on('click', saveAnnouncement);
    initializeEditor();
    loadNotifications();
});
