const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const g = 9.81;
let t = 0;
let dt = 0.05;
let animation;

let trail = [];
let velocities = [];

function launchBall() {
    const angleDeg = parseFloat(document.getElementById("angle").value);
    const force = parseFloat(document.getElementById("force").value);
    const mass = parseFloat(document.getElementById("weight").value);

    if (
        angleDeg < 1 || angleDeg > 89 ||
        force < 1 || force > 500 ||
        mass < 1 || mass > 10
    ) {
        alert("Values must be within the allowed ranges.");
        return;
    }

    cancelAnimationFrame(animation);
    t = 0;
    trail = [];
    velocities = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const angle = angleDeg * Math.PI / 180;
    const impulseTime = 0.1;

    const vx0 = (force / mass) * impulseTime * Math.cos(angle);
    const vy0 = (force / mass) * impulseTime * Math.sin(angle);

    const startX = 0;
    const startY = canvas.height;

    document.getElementById("accel").innerText = (-g).toFixed(2);

    function animate() {
        let x = vx0 * t;
        let y = vy0 * t - 0.5 * g * t * t;

        let cx = startX + x * 50;
        let cy = startY - y * 50;

        if (cy > canvas.height) {
            finish(x, y);
            return;
        }

        trail.push({ x: cx, y: cy });

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        trail.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();

        const vx = vx0;
        const vy = vy0 - g * t;
        const speed = Math.sqrt(vx * vx + vy * vy);
        velocities.push(speed);

        drawVector(cx, cy, vx, vy);

        t += dt;
        animation = requestAnimationFrame(animate);
    }

    animate();

    function finish(x, y) {
        const maxV = Math.max(...velocities);
        const avgV = velocities.reduce((a,b)=>a+b,0)/velocities.length;
        const disp = Math.sqrt(x*x + y*y);

        document.getElementById("timeAir").innerText = t.toFixed(2);
        document.getElementById("disp").innerText = (disp).toFixed(2);
        document.getElementById("maxV").innerText = maxV.toFixed(2);
        document.getElementById("avgV").innerText = avgV.toFixed(2);
    }
}

function drawVector(x, y, vx, vy) {
    const scale = 25;

    const endX = x + vx * scale;
    const endY = y - vy * scale;

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}
