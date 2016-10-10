/**
 * Created by konrad
 */
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
