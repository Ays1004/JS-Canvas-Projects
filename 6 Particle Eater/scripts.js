const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(ctx);

let mouse = {
    x:undefined,
    y:undefined
}

const colors = [
    '#1A3636',
    '#40534C',
    '#677D6A',
    '#D6BD98',
    '#1A5319',
    '#508D4E',
    '#80AF81',
    '#6B8A7A'
    
];
function randomColor(colors){
    return colors[Math.floor(Math.random()* colors.length)];
}

window.addEventListener('mousemove',function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

function randomIntfromRange(min, max){
    return Math.floor((Math.random() * (max - min - 1)) + min);
}

function distance(x,y,x1,y1){
    return Math.sqrt(Math.pow(x - x1,2) + Math.pow(y - y1, 2));
}

class Particle {
    constructor(x, y, velocity, radius){
        this.pos = {
            x:x,
            y:y
        };
        this.vel = velocity;
        this.radius = radius;
        this.color = randomColor(colors);
    }

    update(){
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius,0, 2 * Math.PI,false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Player {
    constructor() {
        this.pos = {
            x:mouse.x,
            y:mouse.y
        }
        this.radius = 10;
        this.color = 'black';
    }

    update(){
        this.pos = {
            x:mouse.x,
            y:mouse.y
        }
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius,0, 2 * Math.PI,false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let score = 0;
let player1 = new Player;
let particles = [];
let gameSwitch = true;

function generateParticles(){
    setInterval(() => {
        let radius = randomIntfromRange(8,100);
        let x,y;

        if(Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 -radius : canvas.width + radius;
            y = Math.random() * canvas.height;
            // Math.random() < 0.5 ? 0 -radius : canvas.height + radius;   
        }
        else{
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 -radius : canvas.height + radius;   
        }
        const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x);

        const velocity = {
            x:Math.cos(angle),
            y:Math.sin(angle)
        }

        particles.push(new Particle(x,y,velocity,radius))

        
    }, 200);
           
}

generateParticles();

console.log(particles);

function logic(){
    for(let i = 0; i< particles.length; i++){
        if(distance(player1.pos.x,player1.pos.y,particles[i].pos.x,particles[i].pos.y) <= (player1.radius+particles[i].radius)){
            if(player1.radius >= particles[i].radius){
                particles.splice(i,1);
                player1.radius+= 3;
                score++;
            }
            else{
                stopgame();
            }
        }
    }
}

function stopgame(){
    document.getElementById('canvas1').style.filter = 'brightness(10%)';
    gameSwitch = false;
    // ctx.font = "bold 88px serif";
    // ctx.fillStyle = 'black';
    // ctx.textAlign = "center";
    // ctx.fillText("GAME OVER", 800/2, 800/2);
}

function update(){
    document.getElementById('score').textContent = score;
    player1.update();
    for(let i = 0; i< particles.length;i++){
        particles[i].update();
    }
    logic();
}

function draw(){
    player1.draw();
    for(let i = 0; i< particles.length;i++){
        particles[i].draw();
    }
}

function animate(){
    update();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw();
    requestAnimationFrame(animate);
    // if(gameSwitch == false){
    //     window.cancelAnimationFrame(animate);
    // }
    

}

animate();