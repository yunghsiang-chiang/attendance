$(document).ready(async function () {
    // 功能：根據窗口寬度檢查並設置菜單顯示狀態
    async function checkWindowWidth() {
        if ($(window).width() > 768) {
            $('#navbar-menu').show();  // 如果寬度大於768，顯示菜單
        } else {
            $('#navbar-menu').hide();  // 如果寬度小於等於768，隱藏菜單
        }
    }

    // 初始化：檢查窗口寬度
    await checkWindowWidth();

    // 功能：點擊按鈕切換菜單顯示狀態
    $('.navbar-toggle').click(function () {
        $('#navbar-menu').toggle();  // 切換菜單顯示/隱藏
    });

    // 功能：當窗口大小調整時重新檢查菜單顯示狀態
    $(window).resize(function () {
        checkWindowWidth();
    });

    // 取得 cookie 值
    async function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(/&|;/);
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }
    // 功能：檢查是否有person cookie和person_id
    async function checkPersonId() {
        let personId = await getCookie("person_id");
        if (!personId) {
            // 沒有person_id，則跳轉至登入頁面
            let currentUrl = window.location.href;  // 獲取當前頁面 URL
            let loginUrl = `http://internal.hochi.org.tw:8083/login_attendance?beforeUrls=${encodeURIComponent(currentUrl)}`;
            window.location.href = loginUrl;  // 跳轉到登入頁面
        }
        let userName = await getCookie("person_name");
        if (userName) $('#user_name').text(decodeURIComponent(userName));  // 使用 jQuery 更新顯示使用者名稱
        if (personId) await checkUserPermissions(personId);  // 檢查使用者的權限
    }

    // 功能：檢查使用者的權限
    async function checkUserPermissions(personId) {
        try {
            const response = await fetch('http://internal.hochi.org.tw:8082/api/attendance/get_permissions_infor');
            const permissionsData = await response.json();

            // 檢查 personId 是否在 permissions 中
            const hasPermission = permissionsData.some(permission => permission.permissions === personId);
            if (!hasPermission) {
                // 若沒有權限，則跳轉至指定頁面
                window.location.href = 'http://internal.hochi.org.tw:8083/';
            }
        } catch (error) {
            console.error('獲取權限資料時發生錯誤:', error);
        }
    }

    // 檢查 person_id 是否存在
    /*await checkPersonId();*/
});
