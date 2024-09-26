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
    // 功能：拜訪API並檢查Person_id是否有權限
    async function checkPermission() {
        const allcookie = document.cookie;
        console.log('Cookie 數據:', allcookie);
        const personId = await getCookie('person_id');  // 從 cookie 取得 Person_id
        console.log('取得的 person_id:', personId);  // 調試輸出

        if (!personId || personId.trim() === '') {
            console.log('無法取得Person_id，請重新登入');
            //alert('無法取得Person_id，請重新登入');
            //window.location.href = 'http://internal.hochi.org.tw:8083/login_attendance?beforeUrls=' + encodeURIComponent(window.location.href);
            //return;
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
                console.log('您沒有權限進入此頁面');
                //alert('您沒有權限進入此頁面');
                //window.location.href = 'http://internal.hochi.org.tw:8083/login_attendance?beforeUrls=' + encodeURIComponent(window.location.href);
            }
        } catch (error) {
            console.error('發生錯誤:', error);
            alert('系統錯誤，請稍後再試');
        }
    }

    // 網頁加載時執行權限檢查
    await checkPermission();
});
