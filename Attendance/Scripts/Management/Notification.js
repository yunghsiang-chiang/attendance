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

    // 獲取 Cookie 值
    function getCookie(cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(/&|;/);
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    // 清理 CKEditor HTML 輸出
    function sanitizeContent(content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;

        // 移除不必要的屬性
        tempDiv.querySelectorAll('[data-placeholder]').forEach(node => node.removeAttribute('data-placeholder'));

        return tempDiv.innerHTML;
    }

    // 儲存公告
    async function saveAnnouncement() {
        const title = $('#title').val();
        const issueTime = $('#issue_time').val();
        const startTime = $('#start_time').val();
        const endTime = $('#end_time').val();
        const status = $('#status').val();
        let content = editor.getData();

        // 清理內容
        content = sanitizeContent(content);

        // 獲取 author 和 created_at
        const author = getCookie("person_name");
        const createdAt = new Date().toISOString();

        // 檢查必填欄位
        if (!title || !issueTime || !startTime || !endTime || !status || !content || !author) {
            alert("請完整填寫所有欄位");
            return;
        }

        // 構建 API 請求數據
        const announcementData = {
            title: title,
            content: content,
            author: author, // 從 Cookie 獲取
            issue_time: new Date(issueTime).toISOString(),
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            status: status,
            created_at: createdAt, // 當下系統時間
            updated_at: createdAt // 當下系統時間
        };

        const requestData = { newAnnouncement: announcementData }; // 包裹在 newAnnouncement 屬性內

        try {
            const response = await fetch('http://internal.hochi.org.tw:8082/api/attendance/AddAnnouncement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
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
