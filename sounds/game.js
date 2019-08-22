const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d");


// Khai báo biến và hằng
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
let life = 3; // có 3 mạng để chơi
let SCORE = 0;
const SCORE_UNIT = 10;
let level = 1;
const MAX_LEVEL = 3;
let game_over = false;
let leftArrow = false;
let rightArrow = false;

// Tạo 1 thanh chắn
const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx :5
};

// Vẽ thanh chắn
function drawPaddle(){
    ctx.fillStyle = "#FF00FF";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Điều khiển thanh chắn
document.addEventListener("keydown", function(event){
   if(event.keyCode == 37){
       leftArrow = true;
   }else if(event.keyCode == 39){
       rightArrow = true;
   }
});
document.addEventListener("keyup", function(event){
   if(event.keyCode == 37){
       leftArrow = false;
   }else if(event.keyCode == 39){
       rightArrow = false;
   }
});

// Di chuyển thanh chắn
function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

// Tạo quả bóng
const ball = {
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 4,
    dx : 3 * (Math.random() * 2 - 1),
    dy : -3
}

// Vẽ quả bóng
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    ctx.closePath();
}

// Di chuyển bóng
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// Hàm xử lý va cham của bóng - tường
function ballWallCollision(){
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
        ball.dx = - ball.dx;
        WALL_HIT.play();
    }
    
    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
        WALL_HIT.play();
    }
    
    if(ball.y + ball.radius > cvs.height){
        life--; // chết 1 mạng
        LIFE_LOST.play();
        resetBall();
    }
}

// Đặt lại bóng
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

// Tạo viên gạch
const brick = {
    row : 1,
    column : 5,
    width : 55,
    height : 20,
    offSetLeft : 20,
    offSetTop : 20,
    marginTop : 40,
    fillColor : "#FF6600",
    strokeColor : "#FFF"
};

let bricks = [];

function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

// vẽ các viên gạch
function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // nếu gạch không vỡ
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

            }
        }
    }
}

// Va chạm bóng và gạch
function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // Nếu gạch ko vỡ
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    BRICK_HIT.play();
                    ball.dy = - ball.dy;
                    b.status = false; // gạch bị vỡ
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}

// hiển thị số liệu trong game
function showGameStats(text, textX, textY, img, imgX, imgY){
    // draw text
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Segoe UI";
    ctx.fillText(text, textX, textY);

    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// Hàm vẽ tổng hợp
function draw(){
    drawPaddle();
    
    drawBall();
    
    drawBricks();
    
    // Hiển thị điểm
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    // Hiển thị mạng còn lại
    showGameStats(life, cvs.width - 25, 25, LIFE_IMG, cvs.width-55, 5); 
    // Hiển thị level
    showGameStats(level, cvs.width/2, 25, LEVEL_IMG, cvs.width/2 - 30, 5);
}

//Kiem tra dk game over
function gameOver(){
    if(life <= 0){
        showYouLose();
        game_over = true;
    }
}

// Tăng level
function levelUp(){
    let isLevelDone = true;
    
    // kiểm tra xem tất cả các viên gạch có bị vỡ không
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }
    
    if(isLevelDone){
        WIN.play();
        
        if(level >= MAX_LEVEL){
            showYouWin();
            game_over = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        level++;
    }
}

function update(){
    movePaddle();
    
    moveBall();
    
    ballWallCollision();
    
    ballPaddleCollision();
    
    ballBrickCollision();
    
    gameOver();
    
    levelUp();
}

// Vòng lặp game
function loop(){
    ctx.drawImage(BG_IMG, 0, 0);
    
    draw();
    
    update();
    
    if(! game_over){
        requestAnimationFrame(loop);
    }
}
loop();


// Lựa chọn on/off âm thanh
const soundElement  = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
    // Thay dổi biểu tượng âm thanh on/off
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";
    
    soundElement.setAttribute("src", SOUND_IMG);
    
    // Tắt âm thanh và bật âm thanh
    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}

// Hiển thị hộp thoại Game Over
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// Nút click để chơi lại
restart.addEventListener("click", function(){
    location.reload(); // reload the page
});

// Hiển thị bạn thắng
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// Hiển thị bạn thua
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}