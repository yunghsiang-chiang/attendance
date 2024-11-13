$(document).ready(function () {
    let editor;

    // Initialize CKEditor with custom configuration
    async function initializeEditor() {
        try {
            editor = await ClassicEditor.create(document.querySelector('#content'), {
                ckfinder: { uploadUrl: 'http://internal.hochi.org.tw:8081/api/FileUpload/UploadFiles' }
            });
        } catch (error) {
            console.error('CKEditor 初始化失敗:', error);
        }
    }

    // Save announcement
    async function saveAnnouncement() {
        const title = $('#title').val();
        const content = editor.getData();

        if (!title || !content) {
            alert("請填寫標題和內容");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        try {
            const response = await fetch('/api/save_announcement', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                alert('公告儲存成功');
                loadNotifications();
            } else {
                alert('儲存失敗: ' + await response.text());
            }
        } catch (error) {
            console.error('儲存過程中出錯:', error);
            alert('發生錯誤，無法儲存公告');
        }
    }

    // Load announcements list
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

    // Bind events
    $('#saveButton').on('click', saveAnnouncement);
    initializeEditor();
    loadNotifications();
});
