const canvas = document.getElementById("canvas");
ctx = canvas.getContext('2d');
canvas.width = innerWidth / 1.1;
canvas.height = 450;

//declaring variables
var settingsImg = document.getElementById('settingsImg');
var rotateImg = document.getElementById('rotateImg');
var pause = document.getElementById('pause');
var input = document.getElementById('yourName');
var newGame = document.getElementById('newGame');
var highScore = document.getElementById('highScore');
var highName = document.getElementById('highName');
var score = document.getElementById('score');
var coinsCount = document.getElementById('coinsCount');
var difficulty = document.getElementById('difficulty');
var runnerShape = document.getElementById('runnerShape');
var popup = document.getElementById("popup");
var popupText = document.getElementById('popupText');

// audio switch on/off variables
var mute = document.getElementById('muteImg')
var unmute = document.getElementById('unmuteImg')
var musicOn = document.getElementById('musicOnImg')
var musicOff = document.getElementById('musicOffImg')

// initial positions
var topHoleLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(1, 2);
var bottomHoleLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(1, 2);
var triangleLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(1, 5);
var circleObsX = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(4, 8);
var circleObsY = canvas.height / 2;
var coinTop = getRandomNumber(canvas.height / 4, canvas.height * 3 / 4 - sizeOfParticle);
var coinLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(1, 3);
var clockLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(5, 10);
var invisibleLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(7, 10);

// default variables
var runnerColor = "rgba(240, 52, 52, 1)";
var runnerTop = canvas.height * 3 / 4 - sizeOfParticle;
var runnerLeft = 80;
var widthHole = 80;
var sizeOfParticle = 50;
var coinSize = 40;
var clockSize = 40;
var invisibleSize = 50;
var circleObsRadius = 25;
var count = 0;
var coins = 0;
var speedTimer = 0;
var invisibleTimer = 0;
var rotateAngle = 0;
var nameDisplay;
var scoreDisplay;

//speed of objects
var systemSpeed = 15;
var dParticle = 2;
var dDegree = 6;
var dtopHoleLeft = systemSpeed;
var dbottomHoleLeft = systemSpeed;
var circleObsYspeed = 5;
var degree = 0;

// initial conditions
var invisibility = false;
var systemSlow = false;
var systemMini = false;
var verticalGame = false;
var gameOn = false;
popupText.innerHTML = `Click Space or New Game Button to start the game!`;
canvas.classList.add('disabled');

// audio
var dieSound = new Audio('./assets/audio/die.mp3');
var hitUpSound = new Audio('./assets/audio/hit.mp3');
var hitDownSound = new Audio('./assets/audio/hit.mp3');
var invisibleSound = new Audio('./assets/audio/invisible.wav');
var coinSound = new Audio('./assets/audio/coin.mp3');
var clockSound = new Audio('./assets/audio/clock.wav');
var clickSound = new Audio('./assets/audio/click.mp3');
var backgroundSound = new Audio('./assets/audio/background.mp3');
backgroundSound.loop = true;

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

// media queries for making game playable in mobiles - decreasing system speeds
var mq = window.matchMedia("(max-width: 700px)")
function mediaQueries() {
    if (mq.matches) {
        systemMini = true;
        runnerLeft = 40;
        systemSpeed = 5;
        dParticle = 1;
        dDegree = 3;
        dtopHoleLeft = systemSpeed;
        dbottomHoleLeft = systemSpeed;
    } else {
        systemMini = false;
        runnerLeft = 80;
        systemSpeed = 15;
        dParticle = 2;
        dDegree = 6;
        dtopHoleLeft = systemSpeed;
        dbottomHoleLeft = systemSpeed;
    }
}
mediaQueries();

//resize browser
addEventListener('resize', () => {
    rotateAngle = 0;
    rotateImg.style.transform = `rotate(${rotateAngle}deg)`;
    if (verticalGame == true) {
        canvas.width = innerWidth / 1.1;
        canvas.height = 450;
        runnerTop = canvas.height * 3 / 4 - sizeOfParticle;
    }
    verticalGame = false;
    mediaQueries();
    if (verticalGame == false) {
        canvas.width = innerWidth / 1.1;
        canvas.height = 450;
        document.getElementById('nameDiv').style.removeProperty("display");
        document.getElementById('selectDiv').style.removeProperty("display");
    }
    // update();
});

// event listeners
difficulty.addEventListener('change', () => {
    clickSound.play();
})

runnerShape.addEventListener('change', () => {
    clickSound.play();
})

settingsImg.addEventListener('click', () => {
    document.getElementById('bottom-container').classList.toggle('hide');
})

rotateImg.addEventListener('click', () => {
    if (gameOn == false) {
        clickSound.play();
        if (rotateAngle == 0) {
            rotateAngle = 90;
            rotateImg.style.transform = `rotate(${rotateAngle}deg)`;
            verticalGame = true;
            if (systemMini == true) {
                canvas.width = innerWidth / 1.1;
                canvas.height = innerWidth / 1.1;
            } else {
                canvas.width = 600;
                canvas.height = 600;
                document.getElementById('nameDiv').style.display = "block"
                document.getElementById('selectDiv').style.display = "block"
            }
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(270 * (Math.PI / 180));
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        } else if (rotateAngle == 90) {
            rotateAngle = 0;
            rotateImg.style.transform = `rotate(${rotateAngle}deg)`;
            verticalGame = false;
            if (systemMini == true) {
                canvas.width = innerWidth / 1.1;
                canvas.height = 450;
            } else {
                canvas.width = innerWidth / 1.1;
                canvas.height = 450;
                document.getElementById('nameDiv').style.removeProperty("display");
                document.getElementById('selectDiv').style.removeProperty("display");
            }
        }
    }
})

// utility function
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

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

// powerups
function coinImage() {
    let coinImg = document.getElementById("coinImg");
    ctx.drawImage(coinImg, (coinLeft -= systemSpeed), coinTop, coinSize, coinSize);
}
function clockImage() {
    let clockImg = document.getElementById("clockImg");
    ctx.drawImage(clockImg, (clockLeft -= systemSpeed), canvas.height / 4, clockSize, clockSize);
}
function invisibleImage() {
    let invisibleImg = document.getElementById("invisibleImg");
    ctx.drawImage(invisibleImg, (invisibleLeft -= systemSpeed), canvas.height * 3 / 4 - invisibleSize, invisibleSize, invisibleSize);
}

// Obstacle Triangle Spikes
function drawTriangle(x, y, base, height) {
    ctx.beginPath();
    ctx.moveTo(x, y); //base left point
    ctx.lineTo(x + base / 2, y - height); //line to top point
    ctx.lineTo(x + base, y); //line to another base point
    ctx.fillStyle = "#39A2DB";
    ctx.fill();
    ctx.closePath();
}
function triangleSpikes() {
    triangleLeft -= systemSpeed
    drawTriangle(triangleLeft, canvas.height * 3 / 4 + 1, 50, 20)
    drawTriangle(triangleLeft + 50, canvas.height * 3 / 4 + 1, 50, 20)
    drawTriangle(triangleLeft + 100, canvas.height * 3 / 4 + 1, 50, 20)
}

// Obstacle Circle
function circleObstacle() {
    ctx.beginPath();
    ctx.arc(circleObsX, circleObsY, circleObsRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#39A2DB';
    ctx.fill();
    ctx.closePath();

    if (circleObsY < canvas.height / 4 + 25) {
        circleObsYspeed = -circleObsYspeed
    }
    if (circleObsY > canvas.height * 3 / 4 - 25) {
        circleObsYspeed = -circleObsYspeed;
    }

    circleObsX -= systemSpeed;
    circleObsY += circleObsYspeed;
}

// to detect crash of runner into obstacles and the game stops
function detectCollision() {
    if (invisibility == true) {
        return;
    } else {
        // top hole
        if (runnerTop == canvas.height / 4 && Math.abs(runnerLeft - topHoleLeft) < sizeOfParticle) {
            dieSound.play();
            // console.log("crash");
            cancelAnimationFrame(requestID);
            saveScore();
            gameOver();
        }

        // bottom hole
        if (runnerTop == canvas.height * 3 / 4 - sizeOfParticle && Math.abs(runnerLeft - bottomHoleLeft) < sizeOfParticle) {
            dieSound.play();
            // console.log("crash");
            cancelAnimationFrame(requestID);
            saveScore();
            gameOver();
        }

        // triangle spikes
        if (runnerTop == canvas.height * 3 / 4 - sizeOfParticle && (runnerLeft + sizeOfParticle) > triangleLeft && Math.abs(runnerLeft - triangleLeft) < 150) {
            dieSound.play();
            // console.log("crash");
            cancelAnimationFrame(requestID);
            saveScore();
            gameOver();
        }

        // circle obstacle
        if (Math.abs(runnerTop - circleObsY) < 25 && Math.abs(runnerLeft - circleObsX) < 25) {
            dieSound.play();
            // console.log("crash");
            cancelAnimationFrame(requestID);
            saveScore();
            gameOver();
        }
    }
}

// update canvas all time
function update() {
    // update the other functions
    if (difficulty.value == "medium" || difficulty.value == "hard") {
        triangleSpikes();
    }
    if (difficulty.value == "hard") {
        circleObstacle();
    }
    detectCollision();
    coinImage();
    clockImage();
    invisibleImage();
    drawRunner();

    var topLayer = new Draw(0, 0, canvas.width, canvas.height / 4, '#39A2DB');
    var bottomLayer = new Draw(0, canvas.height * 3 / 4, canvas.width, canvas.height / 4, '#39A2DB');
    var topHole = new Draw(topHoleLeft, 0, widthHole, (canvas.height / 4) + 1, '#A2DBFA');
    var bottomHole = new Draw(bottomHoleLeft, (canvas.height * 3 / 4) - 1, widthHole, (canvas.height / 4) + 1, '#A2DBFA');

    //to re-generate new obstacles
    if (bottomHoleLeft < -widthHole) {
        bottomHoleLeft = Math.floor(Math.random() * canvas.width) + canvas.width;
    }

    if (topHoleLeft < -widthHole) {
        topHoleLeft = Math.floor(Math.random() * canvas.width) + canvas.width;
    }

    if (triangleLeft < -150) {
        triangleLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(1, 5);
    }

    if (circleObsX < -100) {
        circleObsX = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(4, 8)
    }

    //to re-generate new powerups
    if (coinLeft < -50) {
        coinTop = getRandomNumber(canvas.height / 4, canvas.height * 3 / 4 - sizeOfParticle);
        coinLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(1, 3);
    }

    if (clockLeft < -40) {
        clockLeft = Math.floor(Math.random()) * canvas.width + canvas.width * getRandomNumber(13, 18);
    }

    if (invisibleLeft < -50) {
        invisibleLeft = Math.floor(Math.random()) * canvas.width + canvas.width * getRandomNumber(17, 21);
    }

    // to detect crash of runner into powerups and collect them

    // coins
    if (Math.abs(runnerTop - coinTop) < 40 && Math.abs(runnerLeft - coinLeft) < 40) {
        coins++;
        coinsCount.innerHTML = coins;
        coinSound.play();
        coinTop = getRandomNumber(canvas.height / 4, canvas.height * 3 / 4 - sizeOfParticle);
        count += 100;
        coinLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(1, 3);
    }
    // score
    count++
    scoreDisplay = Math.floor(count / 20)
    score.innerHTML = "Score: " + scoreDisplay;

    // invisiblity power
    if (Math.abs(runnerLeft - invisibleLeft) < 50 && runnerTop == canvas.height * 3 / 4 - sizeOfParticle) {
        invisibleSound.play();
        invisibleLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(17, 21);
        console.log("invisible");
        invisibility = true;
        invisibleTimer = 0;
    }
    if (invisibility == true) {
        runnerColor = "rgba(240, 52, 52, 0.3)"
        if (invisibleTimer > 800) {
            invisibility = false;
            runnerColor = "rgba(240, 52, 52, 1)"
        }
        invisibleTimer++
        // console.log(invisibleTimer)
    }

    // clock - makes time slower
    if (runnerTop == canvas.height / 4 && clockLeft < runnerLeft + sizeOfParticle && clockLeft + sizeOfParticle > runnerLeft) {
        clockSound.play();
        clockLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(13, 18);
        speedTimer = 0;
        systemSlow = true;
        if (systemMini == true) {
            systemSpeed = 2.5;
            dtopHoleLeft = systemSpeed;
            dbottomHoleLeft = systemSpeed;
            dParticle = 0.5;
            dDegree = 2;
        } else {
            systemSpeed = 5;
            dtopHoleLeft = systemSpeed;
            dbottomHoleLeft = systemSpeed;
            dParticle = 1;
            dDegree = 3;
        }
        dtopHoleLeft = systemSpeed;
        dbottomHoleLeft = systemSpeed;
    }
    if (systemSlow == true) {
        if (systemMini == true) {
            if (speedTimer > 800) {
                systemSpeed += 0.02;
                dtopHoleLeft = systemSpeed;
                dbottomHoleLeft = systemSpeed;
                if (systemSpeed > 5) {
                    systemSpeed = 5;
                    dParticle = 1;
                    dDegree = 3;
                    systemSlow = false;
                }
            }
        } else if (systemMini == false) {
            if (speedTimer > 800) {
                systemSpeed += 0.05;
                dtopHoleLeft = systemSpeed;
                dbottomHoleLeft = systemSpeed;

                if (systemSpeed > 15) {
                    systemSpeed = 15;
                    dParticle = 2;
                    dDegree = 6;
                    systemSlow = false;
                }
            }
        }
        // console.log(systemSpeed)
        speedTimer += 1
    }
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
                hitDownSound.play();
                clearInterval(x);
                runnerTop = canvas.height / 4
            }
        }, 1)
    } else if (runnerTop == canvas.height / 4) {
        y = setInterval(() => {
            runnerTop += dParticle;
            if (runnerTop >= canvas.height * 3 / 4 - sizeOfParticle) {
                hitUpSound.play();
                clearInterval(y);
                runnerTop = canvas.height * 3 / 4 - sizeOfParticle
            }
        }, 1)
    }
}

// drawing runner - square
function drawRunner() {
    var centerX = runnerLeft + 0.5 * sizeOfParticle;
    var centerY = runnerTop + 0.5 * sizeOfParticle;

    if (runnerTop == canvas.height * 3 / 4 - sizeOfParticle) {
        degree = 0;
        dDegree = 0;
        new Draw(runnerLeft, runnerTop, sizeOfParticle, sizeOfParticle, runnerColor);
    } else if (runnerTop < canvas.height * 3 / 4 - sizeOfParticle && runnerTop > canvas.height / 4) {
        var angle = (Math.PI / 180) * (degree += dDegree)
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.translate(-centerX, -centerY);
        new Draw(runnerLeft, runnerTop, sizeOfParticle, sizeOfParticle, runnerColor);
        ctx.restore();
    } else if (runnerTop == canvas.height / 4) {
        degree = 0;
        dDegree = 0;
        new Draw(runnerLeft, runnerTop, sizeOfParticle, sizeOfParticle, runnerColor);
    }

    // during rotation
    if (degree > 180) {
        degree = 1;
        dDegree = 0;
    }

    if (degree == 0) {
        if (systemMini == true) {
            if (systemSlow == true) {
                dDegree = 2;
            } else {
                dDegree = 3;
            }
        } else if (systemMini == false) {
            if (systemSlow == true) {
                dDegree = 3;
            } else {
                dDegree = 6;
            }
        }
    }
}

document.getElementsByTagName('canvas')[0].addEventListener('click', () => {
    clicked();
})

// event listener on Space
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 32) {
        if (canvas.classList.contains('disabled')) {
            newGameFunc();
        } else {
            clicked();
        }

    }
})

// event listener on New Game button
newGame.addEventListener('click', () => {
    if (count > 1) {
        cancelAnimationFrame(requestID);
        newGameFunc();
    } else {
        newGameFunc();
    }
})

//pause button
pause.addEventListener('click', () => {
    if (pause.innerHTML == "Pause") {
        pause.innerHTML = "Play"
        cancelAnimationFrame(requestID);
        backgroundSound.pause();
    } else if (pause.innerHTML == "Play") {
        pause.innerHTML = "Pause"
        requestID = requestAnimationFrame(animate);
        backgroundSound.play();
    } else if (pause.innerHTML == "New Game") {
        newGameFunc();
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
    gameOn = false;
    rotateImg.parentElement.style.removeProperty("cursor");
    rotateImg.style.removeProperty("cursor");
    rotateImg.parentElement.style.removeProperty("opacity");
    backgroundSound.pause();
    pause.innerHTML = "New Game";
    input.disabled = false;
    popupText.innerHTML = `Hey ${nameDisplay}! <br> The games over! <br> Your Score: ${scoreDisplay}`;
    popup.classList.remove('hide');
    canvas.classList.add('disabled');
}

function newGameFunc() {
    backgroundSound.currentTime = 0;
    backgroundSound.play();
    popup.classList.add('hide');
    canvas.classList.remove('disabled');
    nameDisplay = input.value;
    input.disabled = true;

    // new game initial postions
    topHoleLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(1, 2);
    bottomHoleLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(1, 2);
    triangleLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(1, 5);
    circleObsX = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(4, 8);
    circleObsY = canvas.height / 2;
    coinTop = getRandomNumber(canvas.height / 4, canvas.height * 3 / 4 - sizeOfParticle);
    coinLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(1, 3);
    clockLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(5, 10);
    invisibleLeft = Math.floor(Math.random() * canvas.width) + canvas.width * getRandomNumber(7, 10);

    runnerColor = "rgba(240, 52, 52, 1)";
    runnerTop = canvas.height * 3 / 4 - sizeOfParticle;
    count = 0;
    coins = 0;
    coinsCount.innerHTML = coins;
    pause.innerHTML = "Pause";
    invisibility = false;
    systemSlow = false;
    gameOn = true;
    rotateImg.parentElement.style.cursor = "not-allowed";
    rotateImg.style.cursor = "not-allowed";
    rotateImg.parentElement.style.opacity = "0.5";

    animate();
    mediaQueries();
}

// sounds event listener
unmute.addEventListener('click', () => {
    mute.classList.remove("hide");
    unmute.classList.add("hide");
    dieSound.muted = true;
    hitUpSound.muted = true;
    hitDownSound.muted = true;
    invisibleSound.muted = true;
    coinSound.muted = true;
    clockSound.muted = true;
    clickSound.muted = true;
})
mute.addEventListener('click', () => {
    mute.classList.add("hide");
    unmute.classList.remove("hide");
    dieSound.muted = false;
    hitUpSound.muted = false;
    hitDownSound.muted = false;
    invisibleSound.muted = false;
    coinSound.muted = false;
    clockSound.muted = false;
    clickSound.muted = false;
    clickSound.play();
})
musicOff.addEventListener('click', () => {
    musicOn.classList.remove("hide");
    musicOff.classList.add("hide");
    backgroundSound.muted = false;
})
musicOn.addEventListener('click', () => {
    musicOn.classList.add("hide");
    musicOff.classList.remove("hide");
    backgroundSound.muted = true;
})
