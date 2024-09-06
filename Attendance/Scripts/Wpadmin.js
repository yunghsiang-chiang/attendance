$(document).ready(function () {
    // Check window width and set menu display
    function checkWindowWidth() {
        if ($(window).width() > 768) {
            $('#navbar-menu').show();
        } else {
            $('#navbar-menu').hide();
        }
    }

    // Initial check
    checkWindowWidth();

    // Toggle navigation menu on button click
    $('.navbar-toggle').click(function () {
        $('#navbar-menu').toggle();
    });

    // Check window width on resize
    $(window).resize(function () {
        checkWindowWidth();
    });
});