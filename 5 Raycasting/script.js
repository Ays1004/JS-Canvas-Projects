var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
console.log(ctx);
var mouse = {x : 0, y: 0};

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

function radians(degrees)
{
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi/180);
}

function distance(x,y,x1,y1){
    return Math.sqrt(Math.pow(x - x1,2) + Math.pow(y - y1, 2));
}

// window.addEventListener('resize',function(){
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

// });

window.addEventListener('mousemove',function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});
console.log(mouse);

let wall, walls = [], ray, particle;

class Particle {
    constructor(){
        this.pos = {
            x: mouse.x,
            y: mouse.y
        }
        this.rays = [];
        for(let a = 0; a<360; a+=1){
            this.rays.push(new Ray(this.pos, radians(a)));
        }
    }
    show(){

        // for(let ray of this.rays){
        //     ray.show();
        // }

        let pt = ray.cast(wall);
        if(pt) {
            ctx.fillStyle = 'white';
            ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    look(walls){
        for(let ray of this.rays){
            let closest = null;
            let record = Infinity;
            for(let wall of walls){
                const pt = ray.cast(wall);
                if(pt){
                    let d = distance(this.pos.x, this.pos.y, pt.x, pt.y);
                    if(d< record){
                        record = d;
                        closest = pt;
                    }
                    d = Math.min(d, record);
                

                }
            }
            if(closest) {
                ctx.beginPath();
                ctx.moveTo(this.pos.x,this.pos.y);
                ctx.lineTo(closest.x,closest.y);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
                
                ctx.stroke();
            }
        }
    }
}

class Ray {
    constructor(pos, angle){
        this.pos = pos;
        this.dir = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    lookAt(x, y){
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;

    }

    show(){
        ctx.beginPath();
        ctx.moveTo(this.pos.x,this.pos.y);
        ctx.lineTo(this.pos.x + this.dir.x*50,this.pos.y + this.dir.y*50);
        ctx.strokeStyle = 'white';
        ctx.stroke(); 
    }
    cast(wall) {
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        
        if (den == 0) return;
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        if(t>0 && t<1 && u>0){
            const pt = {
                x: x1 + t *(x2 - x1),
                y: y1 + t *(y2 - y1)
            }
            return pt;
        } 
        else {
            return;
        }
    }
}

class Boundary {
    constructor(x1, y1, x2, y2){
        this.a = {x:x1, y:y1};
        this.b = {x:x2, y:y2};
    }

    show(){
        ctx.beginPath();
        ctx.moveTo(this.a.x,this.a.y);
        ctx.lineTo(this.b.x,this.b.y);
        ctx.strokeStyle = 'white';
        ctx.stroke();        
    }
}

for(let i = 0; i<5; i++){
    let x1 = Math.random() * canvas.width;
    let x2 = Math.random() * canvas.width;
    let y1 = Math.random() * canvas.height;
    let y2 = Math.random() * canvas.height;

    walls[i] = new Boundary(x1, y1, x2, y2);
}
walls.push(new Boundary(0,0,canvas.width,0));
walls.push(new Boundary(canvas.width,0,canvas.width,canvas.height));
walls.push(new Boundary(0,canvas.height,canvas.width,canvas.height));
walls.push(new Boundary(0,0,0,canvas.height));

function setup(){
    

    wall = new Boundary(1000,100,1000,800);
    ray = new Ray(500, 450);
    particle = new Particle();
    particle.pos = mouse;
}

function draw(){
    for(let wall of walls){
        wall.show();
        particle.look(walls);
    }
    particle.show();
}

function animate(){
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    setup();
    draw();
    requestAnimationFrame(animate);
}

animate();