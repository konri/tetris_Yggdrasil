/**
 * Created by konrad
 */
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
