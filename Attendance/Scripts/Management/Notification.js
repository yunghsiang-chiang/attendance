$(document).ready(function () {
    let editor;
    let currentPage = 1; // 當前頁碼
    const itemsPerPage = 10; // 每頁顯示 10 筆公告
    let currentAnnouncementId = null; // 用於跟蹤目前正在編輯的公告 ID

    // 初始化 CKEditor
    async function initializeEditor() {
        try {
            editor = await ClassicEditor.create(document.querySelector('#content'), {
                ckfinder: { uploadUrl: 'https://internal.hochi.org.tw:8081/api/FileUpload/UploadFiles' }
            });
        } catch (error) {
            console.error('CKEditor 初始化失敗:', error);
        }
    }

    // 動態設置狀態底色
    function getStatusClass(status) {
        switch (status) {
            case 'draft': return 'list-group-item-warning'; // 草稿 (淡黃色)
            case 'published': return 'list-group-item-success'; // 已發佈 (淡綠色)
            case 'archived': return 'list-group-item-danger'; // 已存檔 (淡紅色)
            default: return '';
        }
    }

    // 分頁處理
    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const pagination = $('#pagination');
        pagination.empty();

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = $(`<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>`);
            pageItem.on('click', function (e) {
                e.preventDefault();
                currentPage = i;
                loadNotifications();
            });
            pagination.append(pageItem);
        }
    }

    // 加載公告清單
    async function loadNotifications() {
        try {
            const response = await fetch('https://internal.hochi.org.tw:8082/api/attendance/GetAnnouncements');
            if (!response.ok) throw new Error('加載公告清單失敗');

            const announcements = (await response.json()).$values || [];
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedData = announcements.slice(startIndex, startIndex + itemsPerPage);

            $('#notificationList').empty();

            paginatedData.forEach(announcement => {
                const listItem = $(`
                    <li class="list-group-item ${getStatusClass(announcement.status)}" 
                        data-id="${announcement.announcement_id}" 
                        data-status="${announcement.status}">
                        <strong>${announcement.title}</strong>
                        <br>
                        <small>狀態: ${announcement.status}, 創立日期: ${new Date(announcement.created_at).toLocaleString()}</small>
                    </li>
                `);

                listItem.on('click', function () {
                    if (announcement.status === 'archived') {
                        // 彈出模態框
                        $('#modalTitle').text(announcement.title);
                        $('#modalContent').html(announcement.content);
                        $('#announcementModal').modal('show');
                    } else {
                        // 回填表單
                        currentAnnouncementId = announcement.announcement_id; // 設置當前公告 ID
                        $('#title').val(announcement.title);
                        $('#issue_time').val(new Date(announcement.issue_time).toISOString().slice(0, 16));
                        $('#start_time').val(new Date(announcement.start_time).toISOString().slice(0, 16));
                        $('#end_time').val(new Date(announcement.end_time).toISOString().slice(0, 16));
                        $('#status').val(announcement.status);
                        editor.setData(announcement.content);
                    }
                });

                $('#notificationList').append(listItem);
            });

            renderPagination(announcements.length);
        } catch (error) {
            console.error('公告清單加載錯誤:', error);
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

    // 清空表單
    function resetForm() {
        currentAnnouncementId = null; // 清空當前公告 ID
        $('#title').val('');
        $('#issue_time').val('');
        $('#start_time').val('');
        $('#end_time').val('');
        $('#status').val('draft');
        editor.setData('');
    }

    // 儲存公告
    async function saveAnnouncement() {
        const title = $('#title').val();
        const issueTime = $('#issue_time').val();
        const startTime = $('#start_time').val();
        const endTime = $('#end_time').val();
        const status = $('#status').val();
        let content = editor.getData();

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
            announcement_id: currentAnnouncementId || 0, // 新增時設為 0
            title,
            content,
            author,
            issue_time: new Date(issueTime).toISOString(),
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            status,
            created_at: currentAnnouncementId ? undefined : createdAt, // 新增時設置，修改時保留
            updated_at: createdAt,
        };

        try {
            const response = await fetch('https://internal.hochi.org.tw:8082/api/attendance/AddAnnouncement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(announcementData),
            });

            if (response.ok) {
                alert(currentAnnouncementId ? '公告更新成功' : '公告新增成功');
                resetForm(); // 清空表單
                loadNotifications(); // 重新加載公告清單
            } else {
                alert('儲存失敗: ' + await response.text());
            }
        } catch (error) {
            console.error('儲存過程中出錯:', error);
            alert('發生錯誤，無法儲存公告');
        }
    }

    // 綁定事件
    $('#saveButton').on('click', saveAnnouncement);
    $('#resetFormButton').on('click', resetForm);
    initializeEditor();
    loadNotifications();
});
