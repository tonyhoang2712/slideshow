// below is the plugin code
'use strict';




var TH_Slider = (function () {

    var parent = document.querySelector('#TH-slider');

    function TH_hasClass(el, className) {
        return el.classList ? el.classList.contains(className) : new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }

    function TH_addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    function TH_removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    function TH_resize(c, t) {
        onresize = function() {
            clearTimeout(t);
            t = setTimeout(c, 100);
        }
        return onresize;
    }

    var SlideShow = function (settings) {
        var _ = this;
        _.default = {
            target: parent.querySelector('.slider'),
            dotsWrapper: parent.querySelector('.dots-wrapper'),
            arrowLeft: parent.querySelector('.arrow-left'),
            arrowRight: parent.querySelector('.arrow-right'),
            transition: {
                speed: 500,
                easing: "",
                delay: 3500
            },
            autoHeight: true,
            slideH: parseInt(parent.querySelector('.slider').offsetHeight),
            curSlide: 0,
            swipe: true,
            autoplay: true,
            interval: null,
            stopInterval: false,
            isDots: true,
            isArrows: true
        }
        _.def = _.merge(_.default, settings);

        _.setBackgroundImage();

         window.addEventListener("resize", TH_resize(function () {
            _.setBackgroundImage();
         }), false);


        _.init();

        _.autoplay();

    }

    SlideShow.prototype.merge = function(obj1, obj2) {
        console.log({ ...obj1, ...obj2 });
        return { ...obj1, ...obj2 }
    };

    SlideShow.prototype.init = function () {
        var _ = this;

        var nowHTML = _.def.target.innerHTML;
        _.def.target.innerHTML = '<div class="slider-inner">' + nowHTML + '</div>';

        _.totalSlides = _.def.target.querySelectorAll(".slide").length;

        _.sliderInner = _.def.target.querySelector('.slider-inner');

        var cloneFirst = _.def.target.querySelectorAll('.slide')[0].cloneNode(true);
        _.sliderInner.appendChild(cloneFirst);

        var cloneLast = _.def.target.querySelectorAll('.slide')[_.totalSlides - 1].cloneNode(true);
        _.sliderInner.insertBefore(cloneLast, _.sliderInner.firstChild);

        _.def.curSlide++;
        _.allSlides = _.def.target.querySelectorAll('.slide');

        _.sliderInner.style.height = (_.totalSlides + 2) * 100 + "%";

        _.sliderInner.style.bottom = -_.def.slideH * _.def.curSlide + "px";

        for (var i = 0; i < _.allSlides.length; i++) {
            _.allSlides[i].style.height = 100 / (_.totalSlides + 2) + "%";
        }

        var display = _.def.isArrows ? 'block' : 'none';
        _.def.arrowLeft.style.display = display;
        _.def.arrowRight.style.display = display;

        _.initArrows();
        _.buildDots();
        _.setDot(1);

        window.addEventListener("resize", TH_resize(function () {
            _.updateSliderDimension();
        }), false);
    }

    SlideShow.prototype.setBackgroundImage = function() {
        var _ = this;
        var images = parent.querySelectorAll(".slide");
        
        if(window.innerWidth <= 767.98 || document.body.clientWidth <= 767.98 || document.documentElement.clientWidth <= 767.98) {
            for (var j = 0; j < images.length; j++) {
                var image = images[j].getAttribute('slide-sp') ? images[j].getAttribute('slide-sp') : images[j].getAttribute('slide-pc');
                images[j].style.backgroundImage = 'url(' + image + ')';
            } 
        } else {
           for (var j = 0; j < images.length; j++) {
                images[j].style.backgroundImage = 'url(' + images[j].getAttribute('slide-pc') + ')';
            }
        }
        
    }

    SlideShow.prototype.updateSliderDimension = function () {
        var _ = this;
        _.def.curSlide = 0;
        _.sliderInner.style.bottom = 0;

        _.def.slideH = parseInt(parent.querySelector('.slider').offsetHeight);

        for (var i = 0; i < _.allSlides.length; i++) {
            _.allSlides[i].style.height = 100 / (_.totalSlides + 2) + "%";
        }
    }
    SlideShow.prototype.buildDots = function () {
            var _ = this;

            _.def.isDots ? _.def.dotsWrapper.style.display = 'block' : _.def.dotsWrapper.style.display = 'none';

            for (var i = 0; i < _.totalSlides; i++) {
                var dot = document.createElement('li');
                dot.setAttribute('data-slide', i + 1);
                _.def.dotsWrapper.appendChild(dot);
            }

            _.def.dotsWrapper.addEventListener('click', function (e) {
                
                if (e.target && e.target.nodeName == "LI") {
                    clearInterval(_.def.interval);
                    
                    _.def.curSlide = e.target.getAttribute('data-slide');
                    setTimeout(function () {
                        _.gotoSlide();
                    }, 20);

                    setTimeout(function () {
                        _.autoplay();
                    }, _.def.transition.delay);
                }
            }, false);
        }

    SlideShow.prototype.setDot = function (curSlide) {
        var _ = this;
        var tardot = curSlide - 1;

        for (var j = 0; j < _.totalSlides; j++) {
            TH_removeClass(_.def.dotsWrapper.querySelectorAll('li')[j], 'active');
        }

        if (_.def.curSlide - 1 < 0) {
            tardot = _.totalSlides - 1;
        } else if (_.def.curSlide - 1 > _.totalSlides - 1) {
            tardot = 0;
        }

        TH_addClass(_.def.dotsWrapper.querySelectorAll('li')[tardot], 'active');
    }

    SlideShow.prototype.initArrows = function () {
        var _ = this;

        if (_.def.arrowLeft != '') {
            _.def.arrowLeft.addEventListener('click', function () {
                if (!TH_hasClass(_.def.target, 'isAnimating')) {

                    clearInterval(_.def.interval);

                    if (_.def.curSlide == 1) {
                        _.def.curSlide = _.totalSlides + 1;
                        _.sliderInner.style.bottom = -_.def.curSlide * _.def.slideH + 'px';
                    }

                    _.def.curSlide--;
                    setTimeout(function () {
                        _.gotoSlide();
                    }, 20);

                    setTimeout(function () {
                        _.autoplay();
                    }, _.def.transition.delay);
                }
            }, false);
        }

        if (_.def.arrowRight != '') {
            _.def.arrowRight.addEventListener('click', function () {
                if (!TH_hasClass(_.def.target, 'isAnimating')) {

                    clearInterval(_.def.interval);

                    if (_.def.curSlide == _.totalSlides) {
                        _.def.curSlide = 0;
                        _.sliderInner.style.bottom = -_.def.curSlide * _.def.slideH + 'px';
                    }

                    _.def.curSlide++;
                    setTimeout(function () {
                        _.gotoSlide();
                    }, 20);

                    setTimeout(function () {
                        _.autoplay();
                    }, _.def.transition.delay);
                }
            }, false);
        }
    };

    SlideShow.prototype.gotoSlide = function () {
        var _ = this;

        _.sliderInner.style.transition = "bottom " + _.def.transition.speed / 1000 + "s " + _.def.transition.easing;
        _.sliderInner.style.bottom = -_.def.curSlide * _.def.slideH + "px";

        TH_addClass(_.def.target, "isAnimating");
        setTimeout(function () {
            _.sliderInner.style.transition = "";
            TH_removeClass(_.def.target, "isAnimating");
            _.setDot(_.def.curSlide);
        }, _.def.transition.speed);
    };

    SlideShow.prototype.autoplay = function () {
        var _ = this;
        if (!_.def.autoplay) {
            return;
        }

        clearInterval(_.def.interval);
        _.def.interval = setInterval(function () {
            if (_.def.curSlide == _.totalSlides) {
                _.def.curSlide = 0;
                _.sliderInner.style.bottom = -_.def.curSlide * _.def.slideH + 'px';
            }

            _.def.curSlide++;

            setTimeout(function () {
                _.gotoSlide();
                _.setDot(_.def.curSlide);
            }, 20);

        }, _.def.transition.delay);
    }


    return SlideShow;

})();

/*run slide*/
var settings = {
    transition: {
        speed: 500,
        easing: "",
        delay: 3500
    },
    autoplay: true,
    isDots: true,
    isArrows: true,
}

var slider = new TH_Slider(settings);


