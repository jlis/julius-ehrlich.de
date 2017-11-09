var debug = {};
var helper = {};

$(document).ready(function() {
    $('.no-js').removeClass('no-js');
    $('#likes span, #competencies span, #references span, .cv li').hide();

    var delayAnimation = function(el, animation, delay) {
        var delayed = 0;
        el.each(function() {
            var _el = $(this);
            setTimeout(function() {
                _el.
                    addClass(animation + ' animated')
                    .show();
            }, delayed);
            delayed+= delay;
        });
    };

    var playVideo = function() {
        var video = $('#references video').get(0);
        if (video)
        {
            video.play();
        }
    }

    var pauseVideo = function() {
        var video = $('#references video').get(0);
        if (video)
        {
            video.pause();
        }
    }

    var slides = {
        slide_duration: 200,
        container: $('#slides'),
        wrap: $('.wrap', this.container),
        slides: $('.slide', this.container),
        arrows: $('.arrow', this.container),
        arrow_left: $('.arrow-left', this.container),
        arrow_right: $('.arrow-right', this.container),
        arrow_hint: $('.arrow-hint', this.container),
        current_slide: 1,
        slides_num: 0,
        context: (is_ie ? $(document) : $(window)),

        callbacks: {
            'likes': function() {
                var el = $('#likes span');
                el.hide();
                delayAnimation(el, 'fadeInLeft', 250)
            },
            'competences': function() {
                var el = $('#competences span');
                el.hide();
                delayAnimation(el, 'fadeInLeft', 250)
            },
            'cv-2013-2017': function() {
                var el = $('.slide[data-id="cv-2013-2017"] li');
                el.hide();
                delayAnimation(el, 'fadeInUp', 400);
            },
            'cv-2006-2013': function() {
                var el = $('.slide[data-id="cv-2006-2013"] li');
                el.hide();
                delayAnimation(el, 'fadeInUp', 400);
            },
            'cv-1994-2016': function() {
                var el = $('.slide[data-id="cv-1994-2016"] li');
                el.hide();
                delayAnimation(el, 'fadeInUp', 400);
            },
            'references': function() {
                playVideo();

                if (!helper.references_effect)
                {
                    helper.references_effect = true;
                    var el = $('#references span');
                    el.hide();
                    delayAnimation(el, 'fadeInUp', 400);
                }
            }
        },

        init: function() {
            var self = this;
            self.slides_num = self.slides.length;

            self.build_menu();

            var hash = window.location.hash.replace('#', '');
            this.slideToHash(hash, 0);

            self.lazyload();

            if (self.slides_num > 0 && self.current_slide != self.slides_num) {
                self.arrow_right.fadeIn();
            } else {
                self.arrow_right.fadeOut();
            }

            if (self.current_slide < 2) {
                self.arrow_left.hide();
            } else {
                self.arrow_left.fadeIn();
            }

            $(window).on('resize.slides', function() {
                self.resize();
            });

            self.resize(function() {
                self.container.show();
            }, true);

            self.arrows.on('click.slides', function() {
                var direction = ($(this).hasClass('arrow-left') ? 'left' : 'right');
                self.slide(direction);
            });

            if (typeof WOW == 'function')
            {
                new WOW().init();
            }
        },

        slideToHash: function(hash, duration) {
            if (hash != '' && this.slides.filter('[data-id="' + hash + '"]').length) {
                var index = this.slides.filter('[data-id="' + hash + '"]').index();
                this.current_slide = index + 1;
                this.slide_to_offset(this.current_slide - 1, duration);
                this.arrow_right.removeClass('floating');
                this.arrow_hint.text('Siehe, ein Pfeil!');

                if (this.current_slide == this.slides_num)
                {
                    this.arrow_hint.addClass('left');
                }
                if (this.current_slide == 1)
                {
                    this.arrow_hint.removeClass('left');
                }
            }
        },

        resize: function(callback, first_call) {
            var self = this;
            var height = self.context.height();
            var width = self.context.width();

            if (first_call == undefined && is_ie === true) {
                var height = $('body').height();
                var width = $('body').width();
            }

            if (self.current_slide > 1) {
                var current_offset = (width * (self.current_slide - 1)) * -1;
                self.wrap.css('marginLeft', current_offset);
            }

            this.slides.css({
                height: height,
                width: width
            });
            
            this.wrap.css({
                height: height,
                width: width * self.slides_num
            });

            this.container.css({
                height: height,
                width: width
            });

            if (typeof(callback) == 'function') {
                callback();
            }
        },

        slide: function(direction) {
            var self = this;

            this.arrow_right.removeClass('floating');
            this.arrow_hint
                .removeClass('floating')
                .hide();

            if (direction == 'right' && this.current_slide != this.slides_num) {
                this.current_slide++;
            } else if (direction == 'left' && this.current_slide != 1) {
                this.current_slide--;
            }

            this.toggleArrows();
            this.slide_to_offset(this.current_slide - 1);
        },

        toggleArrows: function() {
            if (this.current_slide == this.slides_num) {
                this.arrow_right.fadeOut();
                this.arrow_left.fadeIn();
            } else if (this.current_slide == 1) {
                this.arrow_right.fadeIn();
                this.arrow_left.fadeOut();
            } else {
                this.arrow_right.fadeIn();
                this.arrow_left.fadeIn();
            }
        },

        slide_to_offset: function(offset, duration, skip_arrow_toggle) {
            var self = this;
            var width = self.context.width();

            if (duration == undefined) {
                duration = this.slide_duration;
            }

            if (true != skip_arrow_toggle)
            {
                this.toggleArrows();
            }

            this.wrap.animate({
                marginLeft: (width * offset) * -1
            }, duration, 'swing', function() {
                setTimeout(function() {
                    var id = self.slides.eq(self.current_slide - 1).data('id');
                    if (id != undefined) {
                        window.location.hash = id;

                        pauseVideo();
                        if (typeof self.callbacks[id] === 'function')
                        {
                            self.callbacks[id]();

                            if (id != 'references')
                            {
                                self.callbacks[id] = null; 
                            }

                            if (_gaq)
                            {
                                _gaq.push(['_trackPageview' ,'/' + id + '/']);
                            }
                        }
                    }
                }, 50);
            });
        },

        lazyload: function(index) {
            var self = this;
            self.slides.each(function() {
                if ($(this).find('img.lazy')) {
                    var img = $(this).find('img.lazy');
                    img.css({
                        'visibility': 'hidden',
                        'opacity': 0
                    })
                    .attr('src', img.attr('data-img'))
                    .load(function() {
                        img.css('visibility', 'visible')
                        .animate({'opacity': 1});
                    });
                }
            });
        },

        build_menu: function() {
            var self = this;
            var slides = this.slides.filter('[data-title]');

            if (slides.length)
            {
                var menu = $('<div>')
                    .addClass('menu')
                    .append($('<div>')
                        .addClass('wrap')
                        .append($('<ul>'))
                    ).append($('<a>')
                        .addClass('tip')
                        .text('Menu')
                    );

                slides.each(function() {
                    var title = $(this).attr('data-title');
                    var id = $(this).attr('data-id');

                    if (title != undefined || title != '')
                    {
                        $('ul', menu).append('<li><a href="#' + id + '">' + title + '</a></li>');
                    }
                });

                this.container.append(menu);

                $(document).on('click', function() {
                    var menu = $('.menu', self.container)
                    if ($('.wrap:visible', menu).length)
                    {
                        $('.wrap', menu).slideUp(300);
                        $('.tip', menu).text('Menu');
                    }
                });

                $('.menu .tip', this.container).on('click', function(e) {
                    e.stopPropagation();
                    var wrap = $(this).parent().find('.wrap');
                    $(this).text(wrap.filter(':visible').length ? 'Menu' : 'x');
                    wrap.slideToggle(300);
                });

                $('.menu li a', this.container).on('click', function(e) {
                    e.preventDefault();
                    var hash = $(this).attr('href').replace('#', '');
                    self.slideToHash(hash);
                });
            }
        }
    }

    slides.init();
    debug.slides = slides;

    if (is_ie != true) {
        $('#slides').swipe({
            swipe: function(e, direction) {
                var natural_direction = (direction == 'left' ? 'right' : 'left');
                slides.slide(natural_direction);
            },
            threshold: $(window).width() / 4
        });
    }

    $(document).keydown(function(e){
        if (e.keyCode == 39) {
            e.preventDefault();
            unlockKeydownAchievment();
            slides.slide('right');
        }

        if (e.keyCode == 37) {
            e.preventDefault();
            unlockKeydownAchievment();
            slides.slide('left');
        }
    });

    var unlockKeydownAchievment = function() {
        if (helper.key_pressed == true)
        {
            return;
        }

        var audio = $('<audio>', {
            autoPlay : 'autoplay'
        });

        $('<source>')
            .attr('src', 'img/unlocked.mp3')
            .appendTo(audio);

        $('<source>')
            .attr('src', 'img/unlocked.ogg')
            .appendTo(audio);

        audio
            .hide()
            .appendTo($('body'));

        helper.key_pressed = true;

        var achivement = $('<div>')
            .addClass('keydown-achievment animated fadeInDown')
            .html('Erfolg freigeschaltet:<br>Pfeiltasten!')
            .appendTo($('body'));

        setTimeout(function() {
            achivement
                .removeClass('fadeInDown')
                .addClass('fadeOutUp');
        }, 3000);

        setTimeout(function() {
            achivement.remove();
            audio.remove();
        }, 4000);
    };

    $('.arrow-hint')
        .addClass('fadeInLeft animated')
        .show();

    var cv = {
        slides: $('.slide.cv'),
        open_text: '&rsaquo; mehr',
        close_text: '&lsaquo; weniger',

        init: function() {
            this.details();
        },

        details: function() {
            var self = this;
            $('a.open-details', this.slides).on('click', function() {
                var li = $(this).closest('li');
                var slide = $(this).closest('.slide.cv');

                if (li.hasClass('active'))
                {
                    $(this).html(self.open_text);
                    li.removeClass('active');

                    $('li', slide).each(function() {
                        if ($(this).attr('data-style') == 'up')
                        {
                            $(this).removeClass('down');
                        }
                        else
                        {
                            $(this).addClass('down');
                        }

                        $(this)
                            .find('.details')
                                .fadeOut(300);
                    });
                }
                else
                {
                    $('li', slide).each(function() {
                        $(this)
                            .removeClass('active');

                        if ($(this).attr('data-style') == undefined)
                        {
                            $(this)
                                .attr('data-style', $(this).hasClass('down') ? 'down' : 'up');
                        }

                        $(this)
                            .find('.open-details')
                                .html(self.open_text);

                        $(this)
                            .find('.details')
                                .fadeOut(300);
                    });

                    li
                        .removeClass('down')
                        .addClass('active');

                    $('li', slide)
                        .not('.active')
                        .addClass('down');

                    $('.details', li).fadeIn(300);

                    $(this).html(self.close_text);
                }
            });
        }
    }

    cv.init();
    debug.cv = cv;

    $('.tooltip').tooltipster({
        theme: 'tooltipster',
        offsetY: 0,
        arrowColor: '#ffffff',
        maxWidth: 300
    });
});
