var BRICK_TYPE = {
    NO_BRICK: 0,
    I: 1,
    J: 2,
    L: 3,
    O: 4,
    S: 5,
    T: 6,
    Z: 7
};

var MOVE = {
    LEFT: 0,
    RIGHT: 1,
    DOWN: 2,
    ROTATION: 3,
    PAUSE: 4
};

var KEY = {
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

var SHAPES = {
    I: [
        [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]]
    ],
    J: [
        [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
        [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
        [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
        [[0, 0, 0], [1, 1, 1], [1, 0, 0]]
    ],
    L: [
        [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
        [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
        [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
        [[0, 0, 0], [1, 1, 1], [0, 0, 1]]
    ],
    O: [
        [[1, 1], [1, 1]]
    ],
    S: [
        [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
        [[0, 1, 0], [0, 1, 1], [0, 0, 1]]
    ],
    T: [
        [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
        [[0, 1, 0], [1, 1, 0], [0, 1, 0]],
        [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
        [[0, 1, 0], [0, 1, 1], [0, 1, 0]]
    ],
    Z: [
        [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
        [[0, 0, 1], [0, 1, 1], [0, 1, 0]]
    ]
};


var getShapesForBrickType = function (typeBrick) {
    var shapeTmp;
    switch (typeBrick) {
        case BRICK_TYPE.I:
            shapeTmp = SHAPES.I;
            break;
        case BRICK_TYPE.J:
            shapeTmp = SHAPES.J;
            break;
        case BRICK_TYPE.L:
            shapeTmp = SHAPES.L;
            break;
        case BRICK_TYPE.O:
            shapeTmp = SHAPES.O;
            break;
        case BRICK_TYPE.S:
            shapeTmp = SHAPES.S;
            break;
        case BRICK_TYPE.T:
            shapeTmp = SHAPES.T;
            break;
        case BRICK_TYPE.Z:
            shapeTmp = SHAPES.Z;
            break;
    }
    return shapeTmp;
};

var getTimestamp = function () {
    return new Date().getTime();
};

function Brick(type, widthBoard) {
    this.type = type;
    this.shape = getShapesForBrickType(this.type)[0];
    this.width = widthBoard;
    var center = Math.round((widthBoard - this.shape[0].length) / 2);

    this.topLeft = {row: 0, col: center};
    this.potencialTopLeft = {row: this.topLeft.row, col: this.topLeft.col};
    this.potencialShape = 0;
}

Brick.prototype.potentialMoveBrick = function (move) {
    switch (move) {
        case MOVE.LEFT:
            this.potencialTopLeft.col -= 1;
            break;
        case MOVE.RIGHT:
            this.potencialTopLeft.col += 1;
            break;
        case MOVE.DOWN:
            this.potencialTopLeft.row += 1;
            break;
    }
};

Brick.prototype.resetPotentialMove = function () {
    this.potencialTopLeft.row = this.topLeft.row;
    this.potencialTopLeft.col = this.topLeft.col;
};

Brick.prototype.applyPotentialMove = function () {
    this.topLeft.row = this.potencialTopLeft.row;
    this.topLeft.col = this.potencialTopLeft.col;
};

Brick.prototype.potentialRotate = function () {
    var countPossibleRotation = getShapesForBrickType(this.type).length;
    if (this.potencialShape + 1 < countPossibleRotation) {
        this.potencialShape++;
    } else {
        this.potencialShape = 0;
    }
};

Brick.prototype.getPotentialShape = function () {
    return getShapesForBrickType(this.type)[this.potencialShape];
};

Brick.prototype.applyRotation = function () {
    this.shape = this.getPotentialShape();
};

function FactoryBrick(cols) {
    this.cols = cols;

    var getRandomTypeBrick = function () {
        var min = 1;
        var max = 7;
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    this.createBrick = function () {
        var typeBrick = getRandomTypeBrick();
        return new Brick(typeBrick, this.cols);
    }
}

function Board(rows, cols) {
    this.private = {};
    this.private.createBoard = function (row, cols) {
        var x = new Array(row);
        for (var i = 0; i < x.length; i++) {
            x[i] = new Array(cols).fill(BRICK_TYPE.NO_BRICK);
        }
        return x;
    }

    this.height = rows;
    this.width = cols;
    this.filled = this.private.createBoard(rows, cols);
    this.currentBrick = null;
    this.graphicsUtils = new GraphicsUtils();
}

Board.prototype.getAbsoluteCoordinates = function (row, col) {
    var absoluteRow = parseInt(row) + parseInt(this.currentBrick.topLeft.row);
    var absoluteCol = parseInt(col) + parseInt(this.currentBrick.topLeft.col);
    return {row: absoluteRow, col: absoluteCol};
};

Board.prototype.getPotentialAbsoluteCoordinates = function (row, col) {
    var absoluteRow = parseInt(row) + parseInt(this.currentBrick.potencialTopLeft.row);
    var absoluteCol = parseInt(col) + parseInt(this.currentBrick.potencialTopLeft.col);
    return {row: absoluteRow, col: absoluteCol};
};

Board.prototype.showBoard = function () {
    var c = document.getElementById("boardCanvas");
    var ctx = c.getContext("2d");
    var self = this;
    var imgDimension = 45;
    var padding = 2;

    var drawImage = function (typeBrick, x, y) {
        var img = self.graphicsUtils.blockImgCreate(typeBrick, imgDimension);
        var abs_x = x * img.width + x * padding;
        var abs_y = y * imgDimension + y * padding;
        ctx.drawImage(img, abs_x, abs_y);
    };

    for (var row in this.filled) {
        for (var col in this.filled[row]) {
            drawImage(this.filled[row][col], col, row);
        }
    }

    for (var row in this.currentBrick.shape) {
        for (var col in this.currentBrick.shape[row]) {
            if (this.currentBrick.shape[row][col] !== BRICK_TYPE.NO_BRICK) {
                var coordinates = this.getAbsoluteCoordinates(row, col);
                drawImage(this.currentBrick.type, coordinates.col, coordinates.row);
            }
        }
    }
};

Board.prototype.fillBrickInBoard = function () {
    for (var row in this.currentBrick.shape) {
        for (var col in this.currentBrick.shape[row]) {
            if (this.currentBrick.shape[row][col] !== BRICK_TYPE.NO_BRICK) {
                var coordinates = this.getAbsoluteCoordinates(row, col);
                this.filled[coordinates.row][coordinates.col] = this.currentBrick.type;
            }
        }
    }
};

Board.prototype.isPossibleToMove = function () {
    for (var row in this.currentBrick.shape) {
        for (var col in this.currentBrick.shape[row]) {
            if (this.currentBrick.shape[row][col] !== BRICK_TYPE.NO_BRICK) {
                var coordinates = this.getPotentialAbsoluteCoordinates(row, col);
                var isInBoard = this.isInBoard(coordinates.row, coordinates.col);
                if (!(isInBoard && this.filled[coordinates.row][coordinates.col] === BRICK_TYPE.NO_BRICK)) {
                    return false;
                }
            }
        }
    }
    return true;
};

Board.prototype.isInBoard = function (row, col) {
    return col >= 0 && col < this.width && row < this.height;
};

Board.prototype.isPossibleToGoDown = function () {
    var checkLastRow = function (row) {
        for (var i in row) {
            if (row[i] !== BRICK_TYPE.NO_BRICK) {
                return true;
            }
        }
        return false;
    };

    this.currentBrick.resetPotentialMove();
    this.currentBrick.potentialMoveBrick(MOVE.DOWN);
    var tmpShape = this.currentBrick.shape.slice(0, this.currentBrick.shape.length);
    var lastShapeRow;

    do {
        var tryRow = tmpShape.pop();
        if (checkLastRow(tryRow)) {
            lastShapeRow = tryRow;
            break;
        }
    } while (tmpShape.length > 0);

    for (var col in lastShapeRow) {
        if (lastShapeRow[col] !== BRICK_TYPE.NO_BRICK) {
            var potentialRow = parseInt(this.currentBrick.shape.length - 1) + parseInt(this.currentBrick.potencialTopLeft.row);
            var potentialCol = parseInt(col) + parseInt(this.currentBrick.potencialTopLeft.col);
            var isInBoard = this.isInBoard(potentialRow, potentialCol);
            if (!(isInBoard && this.filled[potentialRow][potentialCol] === BRICK_TYPE.NO_BRICK)) {
                return false;
            }
        }
    }
    return true;
};

Board.prototype.isPossibleToRotate = function () {
    var potentialShape = this.currentBrick.getPotentialShape();
    for (var row in potentialShape) {
        for (var col in potentialShape[row]) {
            if (potentialShape[row][col] !== 0) {
                var coordinates = this.getPotentialAbsoluteCoordinates(row, col);
                var isInBoard = this.isInBoard(coordinates.row, coordinates.col);
                if (!(isInBoard && this.filled[coordinates.row][coordinates.col] === BRICK_TYPE.NO_BRICK)) {
                    return false;
                }
            }
        }
    }
    return true;
};

Board.prototype.checkFillInRows = function () {
    var ret = false;
    var rowToDelete = [];

    var isRowFullFill = function (row) {
        for (var i in row) {
            if (row[i] === BRICK_TYPE.NO_BRICK) {
                return false;
            }
        }
        return true;
    };

    for (var row in this.filled) {
        if (isRowFullFill(this.filled[row])) {
            rowToDelete.push(row);
        }
    }

    while (rowToDelete.length > 0) {
        var rowDelete = rowToDelete.pop();
        this.filled.splice(rowDelete, 1);
        var emptyLine = new Array(this.width).fill(BRICK_TYPE.NO_BRICK);
        this.filled.unshift(emptyLine);
        ret = true;
    }

    return ret;
};

function GraphicsUtils() {
    var self = this;
    var createCenterClassImg = function (src, width, height) {
        var img = self.createImg(src, width, height);
        img.className = 'center'
        return img;
    };

    this.fadeOut = document.createElement('div');
    this.fadeOut.className = 'overlay';

    this.pauseImg = createCenterClassImg("img/pause.png", 200,200);
    this.awesomeImg = createCenterClassImg("img/awesome.png", 372, 158);
    this.gameOverImg = createCenterClassImg("img/game_over.png", 482, 527);
    this.rockImg = createCenterClassImg("img/you_rock.png", 400, 207);
};

GraphicsUtils.prototype.createImg = function(src, width, height) {
    var img = new Image();
    img.src = src;
    img.width = width;
    img.height = height;
    return img;
};

GraphicsUtils.prototype.blockImgCreate = function (src, imgDimension) {
    return this.createImg("img/block_" + src + ".png", imgDimension, imgDimension);
};

GraphicsUtils.prototype.fadeOutBackground = function () {
    document.getElementById("screen").appendChild(this.fadeOut);
};

GraphicsUtils.prototype.fadeInBackground = function () {
    var list = document.getElementById("screen");

    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
};

GraphicsUtils.prototype.showPauseImg = function () {
    this.fadeOutBackground();
    document.getElementById("screen").appendChild(this.pauseImg);
};

GraphicsUtils.prototype.showGameOver = function () {
    this.fadeOutBackground();
    document.getElementById("screen").appendChild(this.gameOverImg);
};

function SoundsUtils() {
    this.backgroundSoundId = "backgroundSoundId";
    this.clickSoundId = "clickSoundId";
    this.clearRowId = "clearRowId";
    this.loadSounds();
};

SoundsUtils.prototype.loadSounds = function() {
    this.bgSoundInstance = createjs.Sound.registerSound("sound/background_sound.mp3", this.backgroundSoundId);
    this.clearRowInstance = createjs.Sound.registerSound("sound/clear_row.mp3", this.clearRowId);
    this.clickBrickInstance = createjs.Sound.registerSound("sound/click_brick.mp3", this.clickSoundId);
};   

SoundsUtils.prototype.playBackgroundSound = function() {
    if(createjs.Sound.loadComplete(this.bgSoundInstance)) {
        var ppc = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1, volume: 0.5});
        createjs.Sound.play(this.backgroundSoundId, ppc);
    }
};     

SoundsUtils.prototype.stopBackgroundSound = function() {
    createjs.Sound.stop(this.backgroundSoundId);
};

SoundsUtils.prototype.playBrickClick = function() {
    if(createjs.Sound.loadComplete(this.clickSoundId)) {
        var ppc = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_ANY, loop: 0, volume: 0.7});
        createjs.Sound.play(this.clickSoundId, ppc);
    }
};

SoundsUtils.prototype.playClearRow = function() {
    if(createjs.Sound.loadComplete(this.clearRowId)) {
        var ppc = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_ANY, loop: 0, volume: 0.7});
        createjs.Sound.play(this.clearRowId, ppc);
    }
};

function Game(fps) {
    this.fps = fps;
    this.lastTimeRender = 0;
    this.dt = 0;
    this.stepSecond = 0.5;
    this.isPlay = true;
    this.board = new Board(16, 10);
    this.factoryBrick = new FactoryBrick(10);
    this.graphicsUtils = new GraphicsUtils();
    this.soundsUtils = new SoundsUtils();
    this.keyActionQueue = [];
    this.nextBrick = null;

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
            if (this.board.checkFillInRows()) {
                this.soundsUtils.playClearRow();
            }
            this.board.currentBrick = this.factoryBrick.createBrick();
            this.isEndGame();
        }
    }
};

Game.prototype.draw = function () {
    this.board.showBoard();
};

Game.prototype.mainLoop = function () {
    console.log("-------------------------------------------------------------------------------------------");
    var now = getTimestamp();
    var tmp = Math.min(1, (now - this.lastTimeRender) / 1000.00)
    console.log("last time: " + this.lastTimeRender + " time is :" + now + " send to update: " + tmp);
    this.handleKeyEvents(this.keyActionQueue.shift());
        this.update(tmp);
    if (this.isPlay) {
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
        this.graphicsUtils.showGameOver();
    }
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
    this.soundsUtils.playBrickClick();
    switch (keyAction) {
        case MOVE.LEFT:
        case MOVE.RIGHT:
        case MOVE.DOWN:
            this.board.currentBrick.potentialMoveBrick(keyAction);
            break;
        case MOVE.ROTATION:
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
        this.graphicsUtils.fadeInBackground();
    }
};



var game = new Game(30);
game.run();
