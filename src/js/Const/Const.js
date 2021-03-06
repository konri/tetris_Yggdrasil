/**
 * Created by Konrad Hopek
 */

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

var GRAPHICS_ID = {
    PAUSE: 0
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
