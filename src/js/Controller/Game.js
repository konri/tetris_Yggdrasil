/**
 * Created by konrad Hopek
 */
function Game(fps) {
    this.fps = fps;
    this.lastTimeRender = 0;
    this.dt = 0;
    this.stepSecond = 0.5;
    this.isPlay = true;
    this.score = 0;
    this.board = new Board(16, 10);
    this.factoryBrick = new FactoryBrick(10);
    this.graphicsUtils = new GraphicsUtils();
    this.soundsUtils = new SoundsUtils();
    this.keyActionQueue = [];
}

Game.prototype.update = function (idt) {
    console.log("brick is: " + JSON.stringify(this.board.currentBrick.topLeft) + " shape is: " + JSON.stringify(this.board.currentBrick.shape));

    this.dt += idt;
    if (this.dt >= this.stepSecond) {
        this.dt -= this.stepSecond;
        this.board.currentBrick.potentialMoveBrick(MOVE.DOWN);
    }

    if (this.board.isPossibleToMove()) {
        this.board.currentBrick.applyPotentialMove();
    } else {
        var isPossibleToGoDown = this.board.isPossibleToGoDown();
        console.log("possible touch: " + isPossibleToGoDown);
        if (isPossibleToGoDown) {

            console.log("possible to go down: ");
            this.board.currentBrick.applyPotentialMove();
        } else {
            this.board.fillBrickInBoard();
            var checkFillInRows = this.board.checkFillInRows();
            if (checkFillInRows > 0) {
                this.soundsUtils.playClearRow();
                if (checkFillInRows == 1) {
                    this.graphicsUtils.showAwesome();
                    this.addScore(100);
                } else {
                    this.graphicsUtils.showYouRock();
                    this.addScore(checkFillInRows * 150);
                }
            }
            this.board.currentBrick = this.factoryBrick.createBrick();
            this.isEndGame();
        }
    }
};

Game.prototype.draw = function () {
    this.board.showBoard();
    this.drawScore();
};

Game.prototype.mainLoop = function () {
    console.log("-------------------------------------------------------------------------------------------");
    var now = getTimestamp();
    var tmp = Math.min(1, (now - this.lastTimeRender) / 1000.00);
    console.log("last time: " + this.lastTimeRender + " time is :" + now + " send to update: " + tmp);
    this.handleKeyEvents(this.keyActionQueue.shift());
    if (this.isPlay) {
        this.update(tmp);
        this.draw();
    }
    this.lastTimeRender = now;
};

Game.prototype.run = function () {
    console.log("startGame with fps: " + this.fps);
    this.addEventListener();
    this.soundsUtils.playBackgroundSound();
    this.board.currentBrick = this.factoryBrick.createBrick();
    this.lastTimeRender = getTimestamp();
    var self = this;
    setInterval(function () {
        self.mainLoop();
    }, 1000 / this.fps);
};

Game.prototype.startGame = function () {
    this.isPlay = true;
};

Game.prototype.stopGame = function () {
    this.isPlay = false;
};

Game.prototype.isEndGame = function () {
    if (!this.board.isPossibleToMove()) {
        this.stopGame();
        var self = this;
        var restartGame = function () {
            self.restartGame();
        };
        this.graphicsUtils.showGameOver(restartGame);
        this.soundsUtils.playGameOver();
    }
};
Game.prototype.addScore = function (addScore) {
    this.score += addScore;
};

Game.prototype.drawScore = function () {
    document.getElementById('score_container').innerText = "" + this.score;
};

Game.prototype.restartGame = function () {
    this.board = new Board(16, 10);
    this.board.currentBrick = this.factoryBrick.createBrick();
    this.score = 0;
    this.startGame();
};


Game.prototype.addEventListener = function () {
    var keyActionQueue = this.keyActionQueue;
    var keyPressedEvent = function (ev) {
        switch (ev.keyCode) {
            case KEY.LEFT:
                keyActionQueue.push(MOVE.LEFT);
                break;
            case KEY.RIGHT:
                keyActionQueue.push(MOVE.RIGHT);
                break;
            case KEY.UP:
                keyActionQueue.push(MOVE.ROTATION);
                break;
            case KEY.DOWN:
                keyActionQueue.push(MOVE.DOWN);
                break;
            case KEY.SPACE:
                keyActionQueue.push(MOVE.PAUSE);
                break;
        }
        ev.preventDefault();
    };
    document.addEventListener('keydown', keyPressedEvent, false);
};

Game.prototype.handleKeyEvents = function (keyAction) {
    console.log("handlekeyevent: " + keyAction);

    switch (keyAction) {
        case MOVE.LEFT:
        case MOVE.RIGHT:
        case MOVE.DOWN:
            this.soundsUtils.playBrickClick();
            this.board.currentBrick.potentialMoveBrick(keyAction);
            break;
        case MOVE.ROTATION:
            this.soundsUtils.playBrickClick();
            this.board.currentBrick.potentialRotate();
            if (this.board.isPossibleToRotate()) {
                this.board.currentBrick.applyRotation();
            }
            console.log(this.stopGame);
            break;
        case MOVE.PAUSE:
            this.handlePause();
            break;
    }
};

Game.prototype.handlePause = function () {
    if (this.isPlay) {
        this.stopGame();
        this.graphicsUtils.showPauseImg();
    } else {
        this.startGame();
        this.graphicsUtils.fadeInBackground(GRAPHICS_ID.PAUSE);
    }
};
