$(document).ready(async function () {
    // 啟動 CKEditor 並設置圖片上傳 URL
    let editor;
    ClassicEditor
        .create(document.querySelector('#content'), {
            ckfinder: {
                uploadUrl: 'http://internal.hochi.org.tw:8081/api/FileUpload/UploadFiles'  // 這裡設定你的圖片上傳 API URL
            }
        })
        .then(newEditor => {
            editor = newEditor;
        })
        .catch(error => {
            console.error(error);
        });

    // 提交表單數據到 Web API
    $('#saveButton').on('click', async function () {
        // 獲取表單數據
        const title = $('#title').val();
        const content = editor.getData();  // 透過 CKEditor 獲取內容

        if (!title || !content) {
            alert("請填寫標題和內容");
            return;
        }

        // 構建 FormData
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        // 發送 AJAX 請求到 Web API
        try {
            const response = await fetch('/api/save_announcement', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('公告儲存成功');
                loadNotifications(); // 假設有一個方法重新加載公告清單
            } else {
                const errorMessage = await response.text();
                alert('儲存失敗: ' + errorMessage);
            }
        } catch (error) {
            console.error('儲存過程中出錯:', error);
            alert('發生錯誤，無法儲存公告');
        }
    });
});

// 模擬重新加載公告清單
async function loadNotifications() {
    try {
        const response = await fetch('/api/get_notifications');
        if (!response.ok) throw new Error('加載公告清單失敗');

        const notifications = await response.json();
        $('#notificationList').empty();
        notifications.forEach(notification => {
            $('#notificationList').append(`<li>${notification.title}</li>`);
        });
    } catch (error) {
        console.error('公告清單加載錯誤:', error);
    }
}
