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


    var start = new Howl({
        src: ["sound/start.mp3"],
        volume: 0.5,
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
        setTimeout(function () {
            start.play();
        },2000);
        setInterval(function () {
            let goal = document.createElement("img");
            let coordinates = getCoordinates();
            let id_rand = rand(1,1000);
            goal.src = coordinates.char;
            goal.setAttribute("id","char"+id_rand);
            goal.className = "targetChar";
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

            $(goal).appendTo("body").slideDown();
            $("body").on("click", "#char"+id_rand, function (e) {
                shut.play();
                $(this).hide();
                explode(e.pageX, e.pageY);
            });
            // $("body").append(goal);
        }, 3000);
    }


    function getCoordinates() {
        let rand_number = randomArray(["left", "right", "bottom"]);
        let rand_char = randomArray(["img/char1.png", "img/char2.png", "img/char3.png", "img/char4.png"]);
        let rand_char_stand = randomArray(["img/charStand1.png", "img/charStand2.png", "img/charStand3.png", "img/charStand4.png"]);
        if (rand_number === "left") {
            return {left: rand(180, 440) + "px", bottom: 435 + "px", char: rand_char};
        }
        else if (rand_number === "right") {
            return {left: rand(1040, 1267) + "px", bottom: 435 + "px", char: rand_char};
        }
        else {
            return {left: rand(25, 1428) + "px", bottom: 40 + "px", char: rand_char_stand};
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