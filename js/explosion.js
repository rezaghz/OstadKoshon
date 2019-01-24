//- Explosion
//- adapted from "Anchor Click Canvas Animation" by Nick Sheffield
//- https://codepen.io/nicksheffield/pen/NNEoLg/

{
    var colors = ['#ff0000', '#f00000', '#d20000','#c50000','#b00000'];
    var bubbles = 75;

    var explode = function explode(x, y) {
        var particles = [];
        var ratio = window.devicePixelRatio;
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');

        c.style.position = 'absolute';
        c.style.left = x - 100 + 'px';
        c.style.top = y - 100 + 'px';
        c.style.pointerEvents = 'none';
        c.style.width = 200 + 'px';
        c.style.height = 200 + 'px';
        c.style.zIndex = 800;
        c.width = 200 * ratio;
        c.height = 200 * ratio;
        document.body.appendChild(c);

        for (var i = 0; i < bubbles; i++) {
            particles.push({
                x: c.width / 2,
                y: c.height / 2,
                radius: r(20, 30),
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: r(0, 360, true),
                speed: r(8, 12),
                friction: 0.9,
                opacity: r(0, 0.5, true),
                yVel: 0,
                gravity: 0.1 });

        }

        render(particles, ctx, c.width, c.height);
        setTimeout(function () {return document.body.removeChild(c);}, 1000);
    };

    var render = function render(particles, ctx, width, height) {
        requestAnimationFrame(function () {return render(particles, ctx, width, height);});
        ctx.clearRect(0, 0, width, height);

        particles.forEach(function (p, i) {
            p.x += p.speed * Math.cos(p.rotation * Math.PI / 180);
            p.y += p.speed * Math.sin(p.rotation * Math.PI / 180);

            p.opacity -= 0.01;
            p.speed *= p.friction;
            p.radius *= p.friction;
            p.yVel += p.gravity;
            p.y += p.yVel;

            if (p.opacity < 0 || p.radius < 0) return;

            ctx.beginPath();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
            ctx.fill();
        });

        return ctx;
    };

    var r = function r(a, b, c) {return parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));};

 /*   document.querySelector('.logo').addEventListener('mouseover', function (e) {return explode(e.pageX, e.pageY);});*/
}