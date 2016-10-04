var BRICK_TYPE = {
    NO_BRICK : 0,
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
    UP: 3
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
        [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
        [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]]
    ],
    J: [
        [[1,1,0], [0,1,0], [0,1,0]],
        [[0,0,1], [1,1,1], [0,0,0]],
        [[0,1,0], [0,1,0], [0,1,1]],
        [[0,0,0], [1,1,1], [1,0,0]]
    ],
    L: [
        [[0,1,0], [0,1,0], [1,1,0]],
        [[1,0,0], [1,1,1], [0,0,0]],
        [[0,1,1], [0,1,0], [0,1,0]],
        [[0,0,0], [1,1,1], [0,0,1]]
    ],
    O: [
        [[1,1], [1,1]]
    ],
    S: [
        [[0,0,0], [0,1,1], [1,1,0]],
        [[0,1,0], [0,1,1], [1,1,1]]
    ],
    T: [
        [[0,0,0], [1,1,1], [0,1,0]],
        [[0,1,0], [1,1,0], [0,1,0]],
        [[0,1,0], [1,1,1], [0,0,0]],
        [[0,1,0], [0,1,1], [0,1,0]]
    ],
    Z: [
        [[0,0,0], [1,1,0], [0,1,1]],
        [[0,0,1], [0,1,1], [0,1,0]]
    ]
};

var getShapesForBrickType = function(typeBrick) {
    var shapeTmp;
    switch(typeBrick) {
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
    }
    return shapeTmp;
};

function Brick(type, widthBoard) {
    this.type = type;
    this.shape = getShapesForBrickType(this.type)[0]; //get first shape from array.
    this.width = widthBoard;
    this.topLeft = {row: 0 , col: widthBoard / 2}; //initial value for every brick. todo: change widthBoard
    this.potencialTopLeft = {row: this.topLeft.row, col: this.topLeft.col};
    this.potencialShape = 0;
}

Brick.prototype.potentialMoveBrick = function (move) {
    switch (move) {
        case MOVE.LEFT:
            if (this.topLeft.col > 1) {
                this.potencialTopLeft.col -= 1;
            }
            break;
        case MOVE.RIGHT:
            if (this.topLeft.col < this.width - 1) {
                this.potencialTopLeft.col += 1;
            }
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
    var numPossibileRotate = getShapesForBrickType(this.type).length;
    if (potencialShape + 1 < numPossibileRotate) {
        potencialShape++;
    } else {
        potencialShape = 0;
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

    var getRandomTypeBrick = function() {
        var min = 1;
        var max = 4;// BRICK_TYPE.length - 1;
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    this.createBrick = function() {
        var typeBrick = getRandomTypeBrick();
        return new Brick(typeBrick, this.cols);
    }
}

function Board(rows, cols) {
    this.private = {};
    this.private.createBoard = function(row, cols) {
        var x = new Array(row);
        for (var i = 0; i < x.length; i++) {
            x[i] = new Array(cols).fill(BRICK_TYPE.NO_BRICK);
        }
        return x;
    }

    this.rows = rows;
    this.cols = cols;
    this.filled = this.private.createBoard(rows, cols);
    this.currentBrick = null;
}

Board.prototype.showBoard = function() {
    var printBoard = "";

    var toPrintBoard = this.private.createBoard(16,10);

    for (var row in this.filled) {
        for (var col in this.filled[row]) {
            toPrintBoard[row][col] = this.filled[row][col];
        }
    }

    for (var row in this.currentBrick.shape) {
        for (var col in this.currentBrick.shape[row]) {
            if (this.currentBrick.shape[row][col] !== BRICK_TYPE.NO_BRICK) {
                var rowDraw = parseInt(row) + parseInt(this.currentBrick.topLeft.row);
                var colDraw = parseInt(col) + parseInt(this.currentBrick.topLeft.col);
                toPrintBoard[rowDraw][colDraw] = this.currentBrick.type;
            }
        }
    }

    for (var row in toPrintBoard) {
        for (var col in toPrintBoard[row]) {
            printBoard += " " + toPrintBoard[row][col];
        }
        printBoard += "\n";
    }
    console.log(printBoard);
};

Board.prototype.fillBrickInBoard = function() {
    for (var row in this.currentBrick.shape) {
        for (var col in this.currentBrick.shape[row]) {
            if (this.currentBrick.shape[row][col] !== BRICK_TYPE.NO_BRICK) {
                var rowDraw = parseInt(row) + parseInt(this.currentBrick.topLeft.row);
                var colDraw = parseInt(col) + parseInt(this.currentBrick.topLeft.col);
                this.filled[rowDraw][colDraw] = this.currentBrick.type;
            }
        }
    }
};


Board.prototype.isCollision = function() {
    for (var row in this.currentBrick.shape) {
        for (var col in this.currentBrick.shape[row]) {
            if (this.currentBrick.shape[row][col] !== 0) {
                var potentialRow = parseInt(row) + parseInt(this.currentBrick.potencialTopLeft.row);
                var potentialCol = parseInt(col) + parseInt(this.currentBrick.potencialTopLeft.col);
                var isInBoard = this.isInBoard(potentialRow, potentialCol);
                console.log("porencialRow: " + potentialRow + " is in table: " + isInBoard);

                if (!(isInBoard && this.filled[potentialRow][potentialCol] === BRICK_TYPE.NO_BRICK)) {
                    return true;
                }
            }
        }
    }
    return false;
};

Board.prototype.isInBoard = function(row, col) {
    return col >= 0 && col < this.cols && row < this.filled.length;
};

Board.prototype.isPossibleToGoDown = function () {
    this.currentBrick.resetPotentialMove();
    this.currentBrick.potentialMoveBrick(MOVE.DOWN);
    var lastIndex = this.currentBrick.shape.length - 1;
    for (var col in this.currentBrick.shape[lastIndex]) {
        var potentialRow = parseInt(lastIndex) + parseInt(this.currentBrick.potencialTopLeft.row);
        var potentialCol = parseInt(col) + parseInt(this.currentBrick.potencialTopLeft.col);
        var isInBoard = this.isInBoard(potentialRow, potentialCol);
        if (!(isInBoard && this.filled[potentialRow][potentialCol] === BRICK_TYPE.NO_BRICK)) {
            return false;
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
}

function Game(fps) {
    this.fps = fps;
    this._intervalId = -1;
    this.lastRender = 0;
    this.board = new Board(16, 10);
    this.factoryBrick = new FactoryBrick(10);
}

Game.prototype.update = function() {

    //to testing
    var min = 0;
    var max = 2;// BRICK_TYPE.length - 1;

    var move = Math.floor(Math.random()*(max-min+1)+min);

    this.board.currentBrick.potentialMoveBrick(move);
    this.board.currentBrick.potentialMoveBrick(MOVE.DOWN);

    console.log("brick is: " + JSON.stringify(this.board.currentBrick.topLeft) + " shape is: " + this.board.currentBrick.shape);
    console.log("move is: " + move);

    var isCollision = this.board.isCollision();
    console.log("iscollision: " + isCollision);

    if (!isCollision) {
        this.board.currentBrick.applyPotentialMove();
    } else {
        var isPossibleToGoDown = this.board.isPossibleToGoDown();
        console.log("possible touch: " + isPossibleToGoDown);
        if (isPossibleToGoDown) {
            console.log("possible to go down: ");
            this.board.currentBrick.applyPotentialMove();
        } else {
            console.log("nie ma miejsca dawaj nastepne gienka");
            this.board.fillBrickInBoard();
            this.board.currentBrick = this.factoryBrick.createBrick();
        }
    }
};

Game.prototype.draw = function() {
    this.board.showBoard();
};

Game.prototype.mainLoop = function() {
    console.log("-------------------------------------------------------------------------------------------");
    this.update();
    this.draw();
};

Game.prototype.startGame = function() {
    console.log("startGame with fps: " + this.fps);
    this.board.currentBrick = this.factoryBrick.createBrick();
    var self = this;
    this._intervalId = setInterval(function() {
        self.mainLoop();
    }, 1000 / this.fps);
};

Game.prototype.stopGame = function() {
    if (this._intervalId !== -1) {
        clearInterval(this._intervalId);
    }
};

Game.prototype.addEventListener = function () {
    var keyPressedEvent = function (ev) {
        switch(ev.keyCode) {
            case KEY.LEFT:
                this.actions.push(DIR.LEFT);
                break;
            case KEY.RIGHT:
                this.actions.push(DIR.RIGHT);
                break;
            case KEY.UP:
                this.actions.push(DIR.UP);
                break;
            case KEY.DOWN:
                this.actions.push(DIR.DOWN);
                break;
        }
        ev.preventDefault();
    }
    document.addEventListener('keydown', keydown, false);
    // window.addEventListener('resize', resize, false);
};

// function resize(event) {
//   canvas.width   = canvas.clientWidth;  // set canvas logical size equal to its physical size
//   canvas.height  = canvas.clientHeight; // (ditto)
//   ucanvas.width  = ucanvas.clientWidth;
//   ucanvas.height = ucanvas.clientHeight;
//   dx = canvas.width  / nx; // pixel size of a single tetris block
//   dy = canvas.height / ny; // (ditto)
//   invalidate();
//   invalidateNext();
// }


var game = new Game(2);
game.startGame();