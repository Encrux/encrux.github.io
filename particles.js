const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');
const particles = [];

var enableGrowth = false;
var enableGravity = false;
var gravityStrength = 1;
var particleCount = 200;
var initialSpeed = 1;
var randomColor = true;
var pickedParticleColor = 'rgba(255,0,0,1)';

var particleColor = 'rgba(255,0,0,1)';

var mouseX = 0;
var mouseY = 0;
var mousedown = false;

initEventListeners(canvas);

function random (min, max) {
    return Math.random() * (max - min) + min;
}

function draw() {

    particleColor = randomColor ?
        `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`
        : pickedParticleColor;

    const particle = {
        x: mouseX,
        y: mouseY,
        xvel: random(-1,1) * initialSpeed,
        yvel: random(-1,1) * initialSpeed,
        color: particleColor,
        size: 7,
        alpha: 1
    };

    if (mousedown) {
        particles.push(particle);
    }

    if (particles.length > particleCount) {
        particles.shift();
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i += 1){
        const p = particles[i];
        context.fillStyle = p.color;

        if(enableGrowth) {
            p.size += 0.1
        }

        context.fillRect(p.x, p.y, p.size, p.size);
        p.x += p.xvel;
        p.y += p.yvel;

        if (enableGravity) {
            p.yvel += 0.1 * gravityStrength;
        }
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
    });

    canvas.addEventListener("mouseup", function () {
        mousedown = false;
    });

    canvas.addEventListener("touchstart", function (e) {
        if (e.target === canvas) e.preventDefault();
        mousedown = true;
    });

    canvas.addEventListener("touchend", function (e) {
        if (e.target === canvas) e.preventDefault();
        mousedown = false;
    });

    canvas.addEventListener("touchmove", function (e) {
        if (e.target === canvas) e.preventDefault();
        const touch = e.touches[0];
        const cRect = canvas.getBoundingClientRect();
        mouseX = Math.round(touch.clientX - cRect.left);
        mouseY = Math.round(touch.clientY - cRect.top);
    });

    document.getElementById("enable_growth").addEventListener("change", function () {
        enableGrowth = !enableGrowth;
    });

    document.getElementById("enable_gravity").addEventListener("change", function () {
        enableGravity = !enableGravity;
    });

    document.getElementById("gravity_strength").addEventListener("change", function () {
        gravityStrength = document.getElementById("gravity_strength").value;
    });

    document.getElementById("particle_count").addEventListener("change", function () {
        particleCount = document.getElementById("particle_count").value;
    });

    document.getElementById("initialSpeed").addEventListener("change", function () {
        initialSpeed = document.getElementById("initialSpeed").value;
    });

    document.getElementById("random_color").addEventListener("change", function () {
        randomColor = !randomColor;
    })

    document.getElementById("particle_color").addEventListener("change", function () {
        pickedParticleColor = hexToRgbA(document.getElementById("particle_color").value);
    });
}

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length === 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}