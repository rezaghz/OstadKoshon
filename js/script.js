$(function () {
    function printMousePos(event) {
        console.log(
            "clientX: " + event.clientX +
            " - clientY: " + event.clientY);
    }

    document.addEventListener("click", printMousePos);
    let backgrorund = $(".background_image");
    let playBtn = $(".play_btn");
    let char1 = $(".char1_img");
    let logo = $(".logo_img");
    let bg_game = $(".bg");
    let hardshipLevel = $(".hardShipLevel");
    let hardShipLevelImg = $(".hardship_img");
    let hardShipLevelScore;
    const SIZE_CHAR = ["50px", "70px", "80px", "90px", "100px"];
    const CLIENT_X = ["192px", "220px", "300px", "350px"];
    const CLIENT_Y = ["100px", "102px", "104px", "106px"];

    playBtn.addClass('animated slideInLeft');
    char1.addClass('animated slideInDown');
    logo.addClass('animated zoomIn');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost/', true); // This line will trigger an error
    xhr.send();

    var bg = new Howl({
        src: ["sound/bg.MP3"],
        volume: 0.5,
        autoplay: true,
        loop: true,
        html5: true,
    });
    var shut = new Howl({
        src: ["sound/gun-shut.mp3"],
        volume: 1,
    });

    var scream = new Howl({
        volume: 0.7,
        src: ["sound/scream.mp3"],
    });

    bg.play();

    // Step 1
    bg_game.click(function () {
        shut.play();
    });


    playBtn.click(function () {
        playBtn.removeClass('animated slideInLeft');
        char1.removeClass('animated slideInDown');
        setTimeout(function () {
            playBtn.addClass('animated zoomOutLeft');
        }, 200);

        setTimeout(function () {
            char1.addClass("animated fadeOutUp");
        }, 200);
        setTimeout(function () {
            hardshipLevel.css("display", "block");
            hardshipLevel.addClass('animated jackInTheBox');
        }, 200);
    });

    char1.click(function () {
        scream.play();
    });

    char1.mousedown(function () {
        $(this).attr("src", "img/char3.png");
        $(this).mouseup(function () {
            $(this).attr("src", "img/char1.png");
        });
    });


    // step 2

    hardShipLevelImg.click(function () {
        $(this).fadeOut();
        hardShipLevelScore = $(this).data("id");
        setTimeout(function () {
            hardShipLevelImg.addClass('animated bounceOutLeft');
        }, 300);
        logo.removeClass('animated zoomIn');
        setTimeout(function () {
            logo.addClass('animated zoomOutUp');
        }, 300);
        setTimeout(function () {
            backgrorund.css("filter", "blur(0px)");
            bg.stop();
        }, 1000);
        startGame(hardShipLevelScore);
    });

    function startGame(levelScore) {

        setInterval(function () {
            let goal = document.createElement("img");
            let coordinates = getCoordinates();
            goal.src = coordinates.char;
            goal.style.position = "absolute";
            goal.style.zIndex = "500";
            //goal.style.left = randomArray(CLIENT_X);
            goal.style.left = coordinates.left;
            //goal.style.top = randomArray(CLIENT_Y);
            goal.style.bottom = coordinates.bottom;
            goal.style.width = randomArray(SIZE_CHAR);
            // goal.style.width = "150px";
            //console.log(goal);
            //document.body.appendChild(goal);
            setTimeout(function () {
                $(goal).appendTo("body").slideDown();
            }, 10);
            // $("body").append(goal);
        }, 1000);
    }


    function getCoordinates() {
        let rand_number = randomArray(["left","right","bottom"]);
        let rand_char = randomArray(["img/char1.png","img/char2.png","img/char3.png","img/char4.png"]);
        if (rand_number === "left") {
            return {left: rand(180, 440) + "px", bottom: 435 + "px",char:rand_char};
        }
        else if (rand_number==="right"){
            return {left: rand(1040, 1267) + "px", bottom: 435 + "px",char:rand_char};
        }
        else {
            return {left: rand(25, 1428) + "px", bottom: 0 + "px",char:rand_char};
        }
    }

    function rand(start, end) {
        var r = start + Math.floor(Math.random() * (end - start));
        return r;
    }

    function randomArray(array) {
        var rand = array[Math.floor(Math.random() * array.length)];
        return rand;
    }
});

(function ($) {
    "use strict";

    $.fn.halloweenBats = function (options) {
        var Bat,
            bats = [],
            $body = $('body'),
            innerWidth = $body.innerWidth(),
            innerHeight = $body.innerHeight(),
            counter,
            defaults = {
                image: './img/bats.png', // Path to the image.
                zIndex: 10000, // The z-index you need.
                amount: 9, // Bat amount.
                width: 35, // Image width.
                height: 20, // Animation frame height.
                frames: 4, // Amount of animation frames.
                speed: 20, // Higher value = faster.
                flickering: 15 // Higher value = slower.
            };

        options = $.extend({}, defaults, options);

        Bat = function () {
            var self = this,
                $bat = $('<div class="halloweenBat"/>'),
                x,
                y,
                tx,
                ty,
                dx,
                dy,
                frame;

            /**
             * @param {string} direction
             * @returns {number}
             */
            self.randomPosition = function (direction) {
                var screenLength,
                    imageLength;

                if (direction === 'horizontal') {
                    screenLength = innerWidth;
                    imageLength = options.width;
                }
                else {
                    screenLength = innerHeight;
                    imageLength = options.height;
                }

                return Math.random() * (screenLength - imageLength);
            };

            self.applyPosition = function () {
                $bat.css({
                    left: x + 'px',
                    top: y + 'px'
                });
            };

            self.move = function () {
                var left,
                    top,
                    length,
                    dLeft,
                    dTop,
                    ddLeft,
                    ddTop;

                left = tx - x;
                top = ty - y;

                length = Math.sqrt(left * left + top * top);
                length = Math.max(1, length);

                dLeft = options.speed * (left / length);
                dTop = options.speed * (top / length);

                ddLeft = (dLeft - dx) / options.flickering;
                ddTop = (dTop - dy) / options.flickering;

                dx += ddLeft;
                dy += ddTop;

                x += dx;
                y += dy;

                x = Math.max(0, Math.min(x, innerWidth - options.width));
                y = Math.max(0, Math.min(y, innerHeight - options.height));

                self.applyPosition();

                if (Math.random() > 0.95) {
                    tx = self.randomPosition('horizontal');
                    ty = self.randomPosition('vertical');
                }
            };

            self.animate = function () {
                frame += 1;

                if (frame >= options.frames) {
                    frame -= options.frames;
                }

                $bat.css(
                    'backgroundPosition',
                    '0 ' + (frame * -options.height) + 'px'
                );
            };


            x = self.randomPosition('horizontal');
            y = self.randomPosition('vertical');
            tx = self.randomPosition('horizontal');
            ty = self.randomPosition('vertical');
            dx = -5 + Math.random() * 10;
            dy = -5 + Math.random() * 10;

            frame = Math.random() * options.frames;
            frame = Math.round(frame);

            $body.append($bat);
            $bat.css({
                position: 'absolute',
                left: x + 'px',
                top: y + 'px',
                zIndex: options.zIndex,
                width: options.width + 'px',
                height: options.height + 'px',
                backgroundImage: 'url(' + options.image + ')',
                backgroundRepeat: 'no-repeat'
            });

            window.setInterval(self.move, 40);
            window.setInterval(self.animate, 200);
        };

        for (counter = 0; counter < options.amount; ++counter) {
            bats.push(new Bat());
        }

        $(window).resize(function () {
            innerWidth = $body.innerWidth();
            innerHeight = $body.innerHeight();
        });
    };
}(jQuery));
$.fn.halloweenBats({});
