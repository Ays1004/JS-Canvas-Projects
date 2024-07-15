var canvas = document.getElementById('canvas1');
const resetButton = document.getElementById('resetButton');
var ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;
let snakeColor = 'rgb(0,0,0)';
scale = 20;
let score = 0;
var food = [];

resetButton.addEventListener('click', resetGame);

pickLocation();

function resetGame(){
    score = 0;
    s.xSpeed = 1;
    s.ySpeed = 0;
    s = new snake();
    pickLocation();
    document.getElementById('canvas1').style.filter = 'brightness(100%)';
}


function pickLocation(){
    var cols = Math.floor(canvas.width/scale);
    var rows = Math.floor(canvas.height/scale);
    food = {x: (Math.floor(Math.random() * cols)) * scale, y: (Math.floor(Math.random() * rows)) * scale}; 
}


function draw(){
    s.update();
    s.display();
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, scale, scale);
    if (s.eatFood(food)){
        pickLocation();
    }
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw();
    // requestAnimationFrame(animate);  

}

setInterval(animate,1000/10)