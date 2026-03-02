$(function()
{
    setNavbar();
    $(window).on('scroll', () => setNavbar());
    $(window).on('resize', () => setNavbar());

    function setNavbar()
    {
        var $intro = $('#Intro'),
            $about = $('#About'),
            introBottom = $intro.length ? $intro.offset().top + $intro.outerHeight() : 0,
            navHeight = $('.Navigation__bar').outerHeight() || 0,
            aboutTop = $about.length ? $about.offset().top : 0,
            threshold = aboutTop > 0 ? Math.max(0, aboutTop - navHeight) : (introBottom > 0 ? Math.max(0, introBottom - navHeight) : 100);

        if (scrollFromTop() >= threshold)
        {
            $('.Navigation').addClass('Navigation--scrolled');
        }
        else
        {
            $('.Navigation').removeClass('Navigation--scrolled');
        }
    }

    $('.Navigation__mobile-menu').on("click", function()
    {
        $(this).toggleClass('--active');
        $('.Navigation').toggleClass('--mobile-active');
    });

    $(document).on("scroll", menuChangeOnScroll);

    //smoothscroll
    $('a.page-scroll').on('click', function(e)
    {
        e.preventDefault();
        $(document).off("scroll");

        $('a.page-scroll').parent().each(function()
        {
            $(this).removeClass('active');
        })

        $('.Navigation').removeClass('--mobile-active');
        $('.Navigation__mobile-menu').removeClass('--active');

        $(this).parent().addClass('active');

        var target = this.hash,
            menu = target;

        var $target = $(target);
        $('html, body').stop().animate(
        {
            'scrollTop': $target.offset().top + 2
        }, 500, 'swing', function()
        {
            window.location.hash = target;
            $(document).on("scroll", menuChangeOnScroll);
        });
    });
});

function scrollFromTop()
{
    return $(window).scrollTop();
}


function menuChangeOnScroll(event)
{
    var scrollPosition = $(document).scrollTop(),
        fixedMenuHeight = $('.navbar-fixed-top').outerHeight();

    $('a.page-scroll').each(function()
    {
        var currentLink = $(this),
            hrefElement = $(currentLink.attr("href")),
            hrefElementPositionFromTop = hrefElement.position().top,
            currentScroll = scrollPosition + fixedMenuHeight;

        if (hrefElementPositionFromTop <= currentScroll && hrefElementPositionFromTop + hrefElement.height() > currentScroll)
        {
            $('.a.page-scroll').parent().removeClass("active");
            currentLink.parent().addClass("active");
        }
        else
        {
            currentLink.parent().removeClass("active");
        }
    });
}
