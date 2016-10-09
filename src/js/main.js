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
    var center = Math.round(this.width / 2);
    this.topLeft = {row: 0, col: widthBoard / 2};
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
    var imgDimension = 45;
    var paddingHeight = 2;
    var paddingWidth = 2;

    var img_create = function (src) {
        var img = new Image();
        img.src = "img/block_" + src + ".png";
        img.width = imgDimension;
        img.height = imgDimension;
        return img;
    };

    var toPrintBoard = this.private.createBoard(16,10);

    for (var row in this.filled) {
        for (var col in this.filled[row]) {
            toPrintBoard[row][col] = this.filled[row][col];
        }
    }

    for (var row in this.currentBrick.shape) {
        for (var col in this.currentBrick.shape[row]) {
            if (this.currentBrick.shape[row][col] !== BRICK_TYPE.NO_BRICK) {
                var coordinates = this.getAbsoluteCoordinates(row, col);
                toPrintBoard[coordinates.row][coordinates.col] = this.currentBrick.type;
            }
        }
    }

    for (var row in toPrintBoard) {
        var y = row * imgDimension + row * paddingHeight;
        for (var col in toPrintBoard[row]) {
            var img = img_create(toPrintBoard[row][col]);
            var x = col * img.width + col * paddingWidth;
            ctx.drawImage(img, x, y);
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
                var potentialRow = parseInt(row) + parseInt(this.currentBrick.potencialTopLeft.row);
                var potentialCol = parseInt(col) + parseInt(this.currentBrick.potencialTopLeft.col);
                var isInBoard = this.isInBoard(potentialRow, potentialCol);
                console.log("porencialRow: " + potentialRow + " is in table: " + isInBoard);

                if (!(isInBoard && this.filled[potentialRow][potentialCol] === BRICK_TYPE.NO_BRICK)) {
                    return false;
                }
            }
        }
    }
    return true;
};

Board.prototype.checkFillInRows = function () {
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
        console.log("pkb row: " + this.filled[row])
        if (isRowFullFill(this.filled[row])) {
            console.log("pkb add row : " + row);
            rowToDelete.push(row);
        }
    }

    console.log("pkb rowToDelete" + rowToDelete);

    while (rowToDelete.length > 0) {
        var rowDelete = rowToDelete.pop();
        this.filled.splice(rowDelete, 1);
        var emptyLine = new Array(this.width).fill(BRICK_TYPE.NO_BRICK);
        this.filled.unshift(emptyLine);
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
            this.board.checkFillInRows();
            this.board.currentBrick = this.factoryBrick.createBrick();
            this.checkEndGame();
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
    if (this.isPlay) {
        this.update(tmp);
        this.draw();
    }
    this.lastTimeRender = now;
};

Game.prototype.run = function () {
    console.log("startGame with fps: " + this.fps);
    this.addEventListener();
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

Game.prototype.checkEndGame = function () {

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
    } else {
        this.startGame();
    }
};

var game = new Game(30);
game.run();
