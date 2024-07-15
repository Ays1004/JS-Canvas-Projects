let scale = 20;

const scoreDisplay = document.getElementById('score');

function stopgame(){
    document.getElementById('canvas1').style.filter = 'brightness(50%)';
    ctx.font = "bold 88px serif";
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", 800/2, 800/2);
}

const colors = [
    '#ff0000',
    '#ffa500',
    '#ffff00',
    '#008000',
    '#0000ff',
    '#4b0082',
    '#ee82ee'
]
class snake {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.total = 5;
        this.xSpeed = 1;
        this.ySpeed = 0;
        this.tail = [{x: Math.floor(this.x/scale) * scale, y: Math.floor(this.y/scale) * scale}];
        this.color = colors;
        this.i = 0;
        
    }

    update() {
        this.tail.unshift({x:Math.floor(this.x/scale) * scale, y:Math.floor(this.y/scale) * scale});

        scoreDisplay.textContent = this.total - 5;

        if(this.tail.length>this.total){
            this.tail.pop();
        }

        this.x += this.xSpeed*scale;
        this.y += this.ySpeed*scale;
        
        if (this.x >= canvas.width) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = canvas.width - scale;
        }

        if (this.y >= canvas.height) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = canvas.height - scale;
        }
        
        this.tail.forEach(snakePart => {
            if(Math.sqrt( Math.pow((this.x - snakePart.x), 2) + Math.pow((this.y - snakePart.y), 2) ) < 20){
                console.log('ouch');
                stopgame();
                this.xSpeed = 0;
                this.ySpeed = 0;
            }
        });

    }

    display() {
        this.i = 0;
        ctx.fillStyle = snakeColor;
        this.tail.forEach(snakePart => {
            ctx.fillStyle = colors[this.i];
            ctx.fillRect(snakePart.x,snakePart.y,scale,scale);
            ctx.strokeRect(snakePart.x,snakePart.y,scale,scale);
            this.i = (this.i + 1) % colors.length;
            // ctx.stroke();
        });

        
        // for(let i = 0; i< this.tail.length;i++){
        //     ctx.fillStyle = 'maroon';
        //     ctx.fillRect(this.tail[i].x, this.tail[i].y,scale, scale); 
        // }
    }
    direction(a, b) {
        if (a * scale === -this.xSpeed || b * scale === -this.ySpeed) return;

        this.xSpeed = a ;
        this.ySpeed = b ;
    }
    eatFood(pos){

        var d = Math.sqrt( Math.pow((this.x - pos.x), 2) + Math.pow((this.y - pos.y), 2) );

        if(d<20){
            this.total++;
            return true;
        }
        else{
            return false;
        }

    }

}

let s = new snake();