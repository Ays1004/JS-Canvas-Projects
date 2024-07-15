var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
var mouse = {x : undefined, y: undefined};
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize',function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});

window.addEventListener('click', function(event){
    mouse.x = event.x;
    mouse.y = event.y;

    particles.push(new Particle(mouse.x, mouse.y, 100, 'pink', 2));

});

window.addEventListener('mousemove',function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

console.log(ctx);

function changeColor(particle, otherParticle, color ){
    particle.color = color;
    otherParticle.color = color;
}

const colors = [
    '#3ABEF9',
    '#3FA2F6',
    '#1679AB',
    '#FFB1B1'
];
function randomColor(colors){
    return colors[Math.floor(Math.random()* colors.length)];
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: (velocity.x * Math.cos(angle)) - (velocity.y * Math.sin(angle)),
        y: (velocity.x * Math.sin(angle)) + (velocity.y * Math.cos(angle))
    }
    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle){
    // Difference in respective Velocities
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    //Difference in distance
    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    //Prevent accidental overlap of Particles 
    if(xVelocityDiff * xDist + yVelocityDiff * yDist >=0 ){
        
        //Angle between colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        //Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        //velocity before equations
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        //Elastic Collision Equation
        const v1 = {
            x: (u1.x * (m1 - m2) / (m1 + m2)) + ((2 * m2 * u2.x) / (m1 + m2)),
            y: u1.y 
        }
        const v2 = {
            x: (u2.x * (m2 - m1) / (m1 + m2)) + ((2 * m1 * u1.x) / (m1 + m2)),
            y: u2.y
        }

        //Final Velocity after rotating axix back
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        //Swap Particle Velocities to New Velocities
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

function randomIntfromRange(min, max){
    return Math.floor((Math.random() * (max - min - 1)) + min);
}

function distance(x,y,x1,y1){
    return Math.sqrt(Math.pow(x - x1,2) + Math.pow(y - y1, 2));
}

class Particle {
    constructor(x, y, radius, color,mass) {

        this.x = x;
        this.y = y;
        this.velocity = {
            x: (Math.random() -0.5) * 2.5 ,
            y: (Math.random() -0.5) * 2.5
        };
        this.radius = radius;
        this.color = color;
        this.mass = mass;
        this.opacity = 0;
    }
    update(particles){
        for(let i=0 ;i< particles.length; i++){
            if(this === particles[i]){
                continue;
            }
            if(distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius - particles[i].radius < 0 ){
                resolveCollision(this, particles[i]);
            }
        }

        // not letting particles drift off the screen
        if(this.x - this.radius <= 0 || this.x + this.radius >= canvas.width){
            this.velocity.x = -this.velocity.x;
        }
        if(this.y - this.radius <= 0 || this.y + this.radius >= canvas.height){
            this.velocity.y = -this.velocity.y;
        }

        // adding particle velocity
        this.x += this.velocity.x; 
        this.y += this.velocity.y;


        //mouse collision detection
        if(distance(mouse.x , mouse.y, this.x, this.y)< 220 && this.opacity <= 0.4){
            this.opacity += 0.02;
        }
        else if(this.opacity> 0){
            this.opacity -= 0.02;
            this.opacity = Math.max(0, this.opacity);
        }
    };

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    };
    
}


let particles;

function init() {
    particles = [];

    for(let i = 0; i<300; i++){
        const radius = 20;
        let x = randomIntfromRange(radius, canvas.width - radius);
        let y = randomIntfromRange(radius, canvas.height - radius);
        const color = randomColor(colors);
        let mass = 1;

        if(i !== 0 ){
            for(let j = 0;j < particles.length ;j++){
                if(distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0 ){
                    x = randomIntfromRange(radius, canvas.width - radius);
                    y = randomIntfromRange(radius, canvas.height - radius);

                    j = -1;
                }
            }
        }
        particles.push(new Particle(x, y, radius,color, mass));
    }
}

function handleParticles(){
    for(let i = 0; i < particles.length; i++){
        particles[i].update(particles);
        particles[i].draw();

    }

}

function animate(){
    requestAnimationFrame(animate);
    
    ctx.clearRect(0,0, canvas.width, canvas.height);
    handleParticles();
    
}

init();

animate();