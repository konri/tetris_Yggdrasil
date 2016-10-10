/**
 * Created by konrad Hopek
 */

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
