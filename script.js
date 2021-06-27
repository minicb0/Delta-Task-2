const canvas = document.getElementById("canvas");
ctx = canvas.getContext('2d');
canvas.width = innerWidth/1.1;
canvas.height = innerHeight/1.5;

//declaring variables
var topHoleLeft = canvas.width + Math.floor(Math.random()*canvas.width)
var bottomHoleLeft = 2*canvas.width + Math.floor(Math.random()*canvas.width)
var widthHole = 80;
var sizeOfParticle = 50;
var runnerTop = canvas.height * 3 / 4 - sizeOfParticle;
var runnerLeft = 80;
var count = 0;
var nameDisplay;
var scoreDisplay;

//speed of objects
var dParticle = 5;
var dtopHoleLeft = 15;
var dbottomHoleLeft = 15;

var start = document.getElementById('start');
var input = document.getElementById('yourName');
var pause = document.getElementById('pause');
var score = document.getElementById('score');
var dieSound = document.getElementById("die");
var highScore = document.getElementById('highScore');
var highName = document.getElementById('highName');

//initially pause button disabled
pause.disabled = true

//local Storage
var scoreLocal;
if (localStorage.getItem("highScore") == null) {
    var scoreLocal = [
        {
            'hscore': 0,
            'hname': "N/A"
        }
    ]
} else {
    scoreLocal = JSON.parse(localStorage.getItem("highScore"));
}

//resize browser
addEventListener('resize', () => {
    canvas.width = innerWidth/1.1;
    canvas.height = innerHeight/1.5;
});

//functions
function Draw(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}

function update() {
    var topLayer = new Draw(0, 0, canvas.width, canvas.height/4, '#707070');
    var bottomLayer = new Draw(0, canvas.height*3/4, canvas.width, canvas.height, '#707070');
    var square = new Draw(runnerLeft, runnerTop, sizeOfParticle, sizeOfParticle, '#7ab4fa');
    var topHole = new Draw(topHoleLeft, 0, widthHole, canvas.height/4, '#000000');
    var bottomHole = new Draw(bottomHoleLeft, (canvas.height*3/4), widthHole, canvas.height/4, '#000000');

    //to generate new holes
    if (bottomHoleLeft < -widthHole) {
        bottomHoleLeft = Math.floor(Math.random()*canvas.width);
        bottomHoleLeft = bottomHoleLeft + canvas.width;
    }
    if (topHoleLeft < -widthHole) {
        topHoleLeft = Math.floor(Math.random()*canvas.width);
        topHoleLeft = topHoleLeft + canvas.width;
    }

    //to detect crash of particle in hole
    if (runnerTop == canvas.height / 4 && topHoleLeft < runnerLeft + sizeOfParticle && topHoleLeft + sizeOfParticle > runnerLeft) {
        dieSound.play();
        // console.log("crash");
        cancelAnimationFrame(requestID);
        saveScore();
        gameOver();
    }
    if (runnerTop == canvas.height * 3 / 4 - sizeOfParticle && bottomHoleLeft < runnerLeft + sizeOfParticle && bottomHoleLeft + sizeOfParticle > runnerLeft) {
        dieSound.play();
        // console.log("crash");
        cancelAnimationFrame(requestID);
        saveScore();
        gameOver();
    }
    count++
    scoreDisplay = Math.floor(count/20)
    score.innerHTML = "Score:" + scoreDisplay;
}
update();
//saving highScore
function saveScore() {
    if (scoreDisplay > scoreLocal[0].hscore) {
        scoreLocal[0].hscore = scoreDisplay;
        scoreLocal[0].hname = nameDisplay;
    }
    localStorage.setItem("highScore", JSON.stringify(scoreLocal))

    //showing high score
    highScore.innerHTML = scoreLocal[0].hscore;
    highName.innerHTML = scoreLocal[0].hname;
}
saveScore();

function clicked() {
    // console.log('clicked')
    if (runnerTop == canvas.height * 3 / 4 - sizeOfParticle) {
        x = setInterval(() => {
            runnerTop -= dParticle
            if (runnerTop <= canvas.height / 4) {
                clearInterval(x);
                runnerTop = canvas.height / 4
            }
        }, 1)
    } else if (runnerTop == canvas.height / 4) {
        y = setInterval(() => {
            runnerTop += dParticle;
            if (runnerTop >= canvas.height * 3 / 4 - sizeOfParticle) {
                clearInterval(y);
                runnerTop = canvas.height * 3 / 4 - sizeOfParticle
            }
        }, 1)
    }
}

// event listener on click
document.getElementsByTagName('canvas')[0].addEventListener('click', () => {
    clicked();
})

// event listener on space
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 32) {
        clicked();
    }
})

//start button
start.addEventListener('click', () => {
    nameDisplay = input.value;
    pause.disabled = false;
    start.disabled = true;
    input.disabled = true;

    topHoleLeft = canvas.width + Math.floor(Math.random() * canvas.width)
    bottomHoleLeft = 2 * canvas.width + Math.floor(Math.random() * canvas.width)
    runnerTop = canvas.height * 3 / 4 - sizeOfParticle;
    runnerLeft = 80;
    count = 0;

    animate();
})

//pause button
pause.addEventListener('click', () => {
    if (pause.innerHTML == "Pause") {
        pause.innerHTML = "Play"
        cancelAnimationFrame(requestID);
    } else if (pause.innerHTML = "Play") {
        pause.innerHTML = "Pause"
        requestID = requestAnimationFrame(animate);
    }
})

function animate() {
    requestID = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    bottomHoleLeft -= dbottomHoleLeft;
    topHoleLeft -= dtopHoleLeft;
}

//game over
function gameOver() {
    pause.disabled = true;
    start.disabled = false;
    input.disabled = false;
}