/*Слайдер с инстрцкциями по подключению*/
function initRulesSlider() {
    var $list = $(".KP-slider__list");

    $list.each(function(){
        var $slider      = $(this),
            $sliderCover = $slider.parents(".KP-slider"),
            $nextBtn     = $sliderCover.find('.KP-slider__arrows'),
            $dotsCover   = $sliderCover.find('.KP-slider__dotes');

        $slider.owlCarousel({
            items: 1,
            dotsContainer: $dotsCover,
            navContainer: $nextBtn,
            navText: ['', ''],
            margin: 100
        });

        /*Синхронезируем с текстами которые рядом*/
        $slider.on('translate.owl.carousel', function(event) {
            var $parent     = $(event.target).parents('.KP-slider'),
                currentEl   = event.item.index,
                nextColor   = $parent.find('.KP-slider__item').eq(currentEl).data('color'),
                $textLI     = $parent.find('.KP-slider__text-cover ul li'),
                $slidesList = $parent.find('.owl-item');

            $parent.find('.KP-slider__image-cover').css('background-color', nextColor);
            $textLI.removeClass('active');
            $textLI.eq(currentEl).addClass('active');

            $slidesList.removeClass('right-direction').eq(currentEl).prevAll('.owl-item').addClass('right-direction');

            if (window.innerWidth < 768) {
                $('html,body').animate({scrollTop: $parent.offset().top},200);
            }
        });

        /*При иницализации ставим первый цвет по умолчанию*/
        $('.KP-slider__image-cover').each(function () {
            $(this).css('background-color', $(this).find('.KP-slider__item').eq(0).data('color'));
        });
    });
}

/*Обратно синхронизируем список со слайдером*/
$(document).on('click', '.KP-slider__text-cover li', function(){
        var $this = $(this),
            curentItemIndex = $this.index(),
            $sliderParent = $this.parents('.KP-slider');

        $sliderParent.find('.KP-slider__dotes .owl-dot').eq(curentItemIndex).click();
});

function checkBrowsers() {
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isIOS = ua.indexOf("iPhone") > -1;
    if(isAndroid) {
        $('body').addClass('android');
    }
    if(/iphone|ipod|ipad/.test(ua)) {
        $('body').addClass('ios');
    }
}

function checkHeaderPos(currsentScroll, headerAppearancePos, $body){
    if (currsentScroll > 50) {
        $body.addClass('small-header');
        $('.header .ia-btn--bordered').removeClass('ia-btn--bordered').addClass('ia-btn--blue');
    } else {
        $body.removeClass('small-header');
        $('.header .ia-btn--blue').removeClass('ia-btn--blue').addClass('ia-btn--bordered');
    }
}

function scrollTo(sectionClass, speed, correction){
    var $element = $('.' + sectionClass);

    if ($element.size() !== 0){
        $('body,html').animate({
            scrollTop: $element.offset().top - correction
        },speed || 200);
    }
}

$(document).on('click','.to-top-btn',function(){
    $('body,html').animate({
        scrollTop: 0
    }, 400);
});

/*Шевелим ухом кота по клику на него*/
$(document).on('click','.svg-cat-cont',function(){
    var $catEar = $('.svg-cat-ear');

    $catEar.addClass('animate-it');

    setTimeout(function(){
        $catEar.removeClass('animate-it');
    },300);
});

/* <editor-fold desc="Dom ready functions"> */
$(document).ready(function(){
    checkBrowsers();
    initRulesSlider();
});

function castParallax() {
    var opThresh = 350;
    var opFactor = 750;

    window.addEventListener("scroll", function(event){

        var top = this.pageYOffset;

        var layers = document.getElementsByClassName("js-paralax");
        var layer, speed;
        for (var i = 0; i < layers.length; i++) {
            layer = layers[i];
            speed = layer.getAttribute('data-speed');
            var yPos = (top * speed / 100);
            layer.setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px)');

        }
    });
}

function castSmoothScroll() {
    $.srSmoothscroll({
        step: 80,
        speed: 80,
        ease: 'linear'
    });
}

function startSite() {

    var platform = navigator.platform.toLowerCase();
    var userAgent = navigator.userAgent.toLowerCase();
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (window.innerWidth > 1023){
        castParallax();
        if (!isChrome && !isSafari) {
            castSmoothScroll();
        }
    }
}

document.body.onload = startSite();

$(window).on('load', function(){
    $('body').addClass('doc-ready');
});
/* </editor-fold> */





