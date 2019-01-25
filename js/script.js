$(function () {
    /*function printMousePos(event) {
        console.log(
            "clientX: " + event.clientX +
            " - clientY: " + event.clientY);
    }
*/
    //document.addEventListener("click", printMousePos);
   // Cookies.remove("killCounter");
    var cookie = Cookies.get('score');
    var killCounter = Cookies.get('killCounter');
    console.log(cookie,killCounter);
    let backgrorund = $(".background_image");
    let playBtn = $(".play_btn");
    let char1 = $(".char1_img");
    let logo = $(".logo_img");
    let bg_game = $(".bg");
    let hardShipLevelDiv = $(".hardShipLevel");
    let hardShipLevelImg = $(".hardship_img");
    let hardShipLevelScore = 0;
    let EASY_CHANGE_HARDSHIP = 0;
    // counter for live character
    let LOSE_COUNTER = 0;
    // death number for finish the game
    let DEATH_NUMBER = 10;
    // Score for Kill each Teacher
    let SCORE_DEATH = 5;
    // Kill Counter Variable
    let KILL_COUNTER = 0;
    $("#graveNumber").text(DEATH_NUMBER);
    const SIZE_CHAR = ["50px", "70px", "80px", "90px", "100px"];

    playBtn.addClass('animated slideInLeft');
    char1.addClass('animated slideInDown');
    logo.addClass('animated zoomIn');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://ostadkoshon.loc/', true); // This line will trigger an error
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
        volume: 0.6,
    });

    var scream = new Howl({
        volume: 0.7,
        src: ["sound/scream.mp3"],
    });

    var gameoverSound = new Howl({
        volume: 0.7,
        src: ["sound/gameover.mp3"],
    });

    var laugh = new Howl({
        volume: 0.7,
        src: ["sound/laugh.mp3"],
    });


    bg.play();
    backgrorund.ready(function () {
        bg.play();
    });

    // Step 1
    bg_game.click(function () {
        shut.play();
    });

    $("#charGameOver").click(function () {
       laugh.play();
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
            hardShipLevelDiv.css("display", "block");
            hardShipLevelDiv.addClass('animated jackInTheBox');
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
        console.log(hardShipLevelScore);
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
        startGame();
    });


    function startGame() {
        $.fn.halloweenBats({amount: hardShipSecond().numberBats});
        setTimeout(function () {
            start.play();
        }, 2000);
        let counterFor = 1;
        let numberBats = hardShipSecond().numberBats;
        let counterInterVal = 1;
        var insertChar = setInterval(function () {
            if (counterInterVal % 7 === 0) {
                numberBats += hardShipSecond().stepNumberBats;
                $.fn.halloweenBats({amount: numberBats});
                counterFor += hardShipSecond().stepCounter;
            }
            let i = 0;
            for (i = 0; i < counterFor; i++) {
                let goal = document.createElement("img");
                let coordinates = getCoordinates();
                let id_rand = rand(1, 1000);
                goal.src = coordinates.char;
                goal.setAttribute("id", "char" + id_rand);
                goal.className = "animated zoomInDown";
                goal.draggable = false;
                goal.style.position = "absolute";
                goal.style.zIndex = "5";
                //goal.style.left = randomArray(CLIENT_X);
                goal.style.left = coordinates.left;
                //goal.style.top = randomArray(CLIENT_Y);
                goal.style.bottom = coordinates.bottom;
                goal.style.width = randomArray(SIZE_CHAR);
                // goal.style.width = "150px";
                //console.log(goal);
                //document.body.appendChild(goal);
                $(goal).appendTo("body").slideDown();
                var score = $("#score");
                $("body").on("click", "#char" + id_rand, function (e) {
                    KILL_COUNTER++;
                    shut.play();
                    $(this).hide();
                    $(this).remove();
                    // if finish the game not work sum score
                    if (DEATH_NUMBER>0){
                        let scoreValue = parseInt(score.text()) + SCORE_DEATH;
                        score.text(scoreValue);
                    }
                    explode(e.pageX, e.pageY);
                });
                hideChar("#char" + id_rand).then(function (done) {
                    clearInterval(insertChar);
                    if (done) {
                        var cookie_score = Cookies.get('score');
                        var cookie_killCounter = Cookies.get('killCounter');
                        if (cookie_killCounter === undefined){
                            Cookies.set('killCounter', KILL_COUNTER, {expires: 100});
                            cookie_killCounter = KILL_COUNTER;
                        }
                        else {

                            cookie_killCounter=parseInt(cookie_killCounter) + KILL_COUNTER;
                            Cookies.set('killCounter', cookie_killCounter, {expires: 100});
                        }
                        if (cookie_score === undefined) {
                            Cookies.set('score', parseInt(score.text()), {expires: 100});
                        }
                        else if (parseInt(score.text()) > cookie_score) {
                            Cookies.set('score', parseInt(score.text()), {expires: 100});
                            cookie_score = parseInt(score.text());
                        }

                        let gameOver =  $(".gameOver");
                        start.stop();
                        gameoverSound.play();
                        $("#scoreGameOver").text(cookie_score+" امتیاز");
                        $("#killGameOver").text(KILL_COUNTER+" نفر");
                        $("#sumKillGameOver").text(cookie_killCounter + " نفر");
                        gameOver.css("display", "block");
                        gameOver.addClass("animated jackInTheBox");
                    }
                    return false;
                });
                counterInterVal++;
            }
            // $("body").append(goal);
        }, hardShipSecond().add);
    }

    $("#againPlay").click(function () {
       window.location.reload();
    });

    function hideChar(idName) {
        var promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                if ($(idName).length !== 0) {
                    DEATH_NUMBER--;
                    $("#graveNumber").text(DEATH_NUMBER);
                    if (DEATH_NUMBER <= 3) {
                        $(".deathBoard").css("background-color", "#f10202");
                    }
                    let OUT_EFFECT = ["zoomOut fast", "fadeOut faster"];
                    $(idName).removeClass();
                    $(idName).addClass("animated " + randomArray(OUT_EFFECT));
                    if (DEATH_NUMBER <= LOSE_COUNTER) {
                        $("#graveNumber").text(0);
                        resolve('finish');
                        return false;
                    }
                    setTimeout(function () {
                        $(idName).remove();
                    }, 300);
                    //console.log(idName+" ==> pak Shod");
                }
            }, hardShipSecond().remove);
        });
        return promise;
    }

    function hardShipSecond() {
        // 0 easy | 1 medium | hard 2
        // Easy
        if (hardShipLevelScore === 0) {
            return {add: 3000, remove: 3000, stepCounter: 1, numberBats: 8, stepNumberBats: 1}
        }
        // Medium
        else if (hardShipLevelScore === 1) {
            return {add: 3000, remove: 2500, stepCounter: 1, numberBats: 8, stepNumberBats: 1}
        }
        // Hard
        else if (hardShipLevelScore === 2) {
            return {add: 3000, remove: 2000, stepCounter: 1, numberBats: 8, stepNumberBats: 1}
        }
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