$(document).ready(function () {
    // 功能：根據窗口寬度檢查並設置菜單顯示狀態
    function checkWindowWidth() {
        if ($(window).width() > 768) {
            $('#navbar-menu').show();  // 如果寬度大於768，顯示菜單
        } else {
            $('#navbar-menu').hide();  // 如果寬度小於等於768，隱藏菜單
        }
    }

    // 初始化：檢查窗口寬度
    checkWindowWidth();

    // 功能：點擊按鈕切換菜單顯示狀態
    $('.navbar-toggle').click(function () {
        $('#navbar-menu').toggle();  // 切換菜單顯示/隱藏
    });

    // 功能：當窗口大小調整時重新檢查菜單顯示狀態
    $(window).resize(function () {
        checkWindowWidth();
    });

    // 功能：取得cookie中的Person_id
    function getCookieValue(cookieName) {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return null;  // 若找不到cookie則回傳null
    }
    // 功能：拜訪API並檢查Person_id是否有權限
    async function checkPermission() {
        const personId = getCookieValue('Person_id');  // 從cookie取得Person_id

        if (!personId) {
            alert('無法取得Person_id，請重新登入');
            window.location.href = 'http://internal.hochi.org.tw:8083/login_attendance?beforeUrls=' + encodeURIComponent(window.location.href);
            return;
        }

        try {
            // 拜訪API取得權限資料
            const response = await fetch('http://internal.hochi.org.tw:8082/api/attendance/get_permissions_infor', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('API回應錯誤');
            }

            const data = await response.json();

            // 檢查Person_id是否存在於permissions欄位中
            const hasPermission = data.some(item => item.permissions === personId);

            if (!hasPermission) {
                alert('您沒有權限進入此頁面');
                window.location.href = 'http://internal.hochi.org.tw:8083/login_attendance?beforeUrls=' + encodeURIComponent(window.location.href);
            }
        } catch (error) {
            console.error('發生錯誤:', error);
            alert('系統錯誤，請稍後再試');
        }
    }

    // 網頁加載時執行權限檢查
    checkPermission();
});
