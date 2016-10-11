/**
 * Created by konrad Hopek
 */
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
                if (coordinates.col < 0 || coordinates.col >= this.width) {
                    this.currentBrick.resetPotentialMove();
                    return true;
                } else if (!(isInBoard && this.filled[coordinates.row][coordinates.col] === BRICK_TYPE.NO_BRICK)) {
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
    var ret = 0;

    var isRowFullFill = function (row) {
        for (var i in row) {
            if (row[i] === BRICK_TYPE.NO_BRICK) {
                return false;
            }
        }
        return true;
    };

    for (var row = 0; row < this.filled.length; row++) {
        if (isRowFullFill(this.filled[row])) {
            this.filled.splice(row, 1);
            var emptyLine = new Array(this.width).fill(BRICK_TYPE.NO_BRICK);
            this.filled.unshift(emptyLine);
            ret++;
        }
    }

    return ret;
};
