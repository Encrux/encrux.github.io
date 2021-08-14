const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');
const particles = [];

var mouseX = 0;
var mouseY = 0;
var mousedown = false;

initEventListeners(canvas);

function random (min, max) {
    return Math.random() * (max - min) + min;
}

function draw() {
    console.log(mousedown);

    const particle = {
        x: mouseX,
        y: mouseY,
        xvel: random(-1,1),
        yvel: random(-1,1),
        color: `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`,
        size: 7,
    };

    if (mousedown) {
        particles.push(particle);
    }

    if (particles.length > 200) {
        particles.shift();
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i += 1){
        const p = particles[i];
        context.fillStyle = p.color;
        context.fillRect(p.x, p.y, p.size, p.size);
        p.x += p.xvel;
        p.y -= p.yvel;
    }

    window.requestAnimationFrame(draw);

}

window.requestAnimationFrame(draw);

function initEventListeners(canvas) {
    canvas.addEventListener("mousemove", function(e) {
        const cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
        mouseX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas
        mouseY = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make
    });

    canvas.addEventListener("mousedown", function () {
        mousedown = true;
    })

    canvas.addEventListener("mouseup", function () {
        mousedown = false;
    })

    canvas.addEventListener("touchstart", function (e) {
        if (e.target === canvas) e.preventDefault();
        mousedown = true;
    })

    canvas.addEventListener("touchend", function (e) {
        if (e.target === canvas) e.preventDefault();
        mousedown = false;
    })

    canvas.addEventListener("touchmove", function (e) {
        if (e.target === canvas) e.preventDefault();
        const touch = e.touches[0];
        canvas.dispatch(new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        }));
    })
}