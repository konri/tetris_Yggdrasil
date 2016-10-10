/**
 * Created by konrad Hopek
 */

function GraphicsUtils() {
    this.stage = null;
    this.pauseImg = new createjs.Bitmap("img/pause.png");
    this.gameOverImg = new createjs.Bitmap("img/game_over.png");
    this.awesomeImg = new createjs.Bitmap("img/awesome.png");
    this.rockImg = new createjs.Bitmap("img/you_rock.png");
    this.restartGame = new createjs.Bitmap("img/refresh.png");

};

GraphicsUtils.prototype.createImg = function (src, width, height) {
    var img = new Image();
    img.src = src;
    img.width = width;
    img.height = height;
    return img;
};

GraphicsUtils.prototype.showAnimationIn = function (img) {
    this.fadeOutBackground();
    this.adjustCanvas();

    this.stage = new createjs.Stage("canvasAnimate");
    this.stage.addChild(img);

    var bounds = img.getBounds();
    img.x = (window.innerWidth - bounds.width) / 2;
    img.y = 0;

    createjs.Tween.get(img, {loop: false})
        .to({y: (window.innerHeight - bounds.height) / 2}, 1200, createjs.Ease.getPowInOut(4));

    createjs.Tween.get(img, {loop: true})
        .to({alpha: 0}, 1000)
        .to({alpha: 1}, 1000, createjs.Ease.getPowInOut(2));

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.stage);
};

GraphicsUtils.prototype.blockImgCreate = function (src, imgDimension) {
    return this.createImg("img/block_" + src + ".png", imgDimension, imgDimension);
};

GraphicsUtils.prototype.fadeOutBackground = function () {
    document.getElementById("screen").className = "overlay";
};

GraphicsUtils.prototype.fadeInBackground = function (img) {
    var self = this;
    var handleComplete = function () {
        document.getElementById("screen").className = "no_overlay";
        self.stage.removeAllEventListeners();
        self.stage.removeAllChildren();
    };
    if (img === GRAPHICS_ID.PAUSE) {
        createjs.Tween.get(this.pauseImg, {loop: false})
            .to({y: 0}, 500, createjs.Ease.getPowInOut(4))
            .call(handleComplete);
    } else {
        handleComplete();
    }
};

GraphicsUtils.prototype.adjustCanvas = function () {
    var canvas = document.getElementById('canvasAnimate');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

GraphicsUtils.prototype.showPauseImg = function () {
    this.showAnimationIn(this.pauseImg);
};

GraphicsUtils.prototype.showGameOver = function (restartCallback) {
    var self = this;
    var handleClick = function (event) {
        self.fadeInBackground();
        restartCallback();
    };


    this.showAnimationIn(this.gameOverImg);

    var img = this.restartGame;
    this.stage.addChild(img);
    this.stage.enableMouseOver(10);
    var bounds = img.getBounds();
    img.x = (window.innerWidth - bounds.width) / 2;
    img.y = (window.innerHeight - bounds.height);

    var gamOverImgBounds = this.gameOverImg.getBounds();
    createjs.Tween.get(img, {loop: false})
        .to({y: (window.innerHeight - gamOverImgBounds.height) / 2 + gamOverImgBounds.height + 50}, 1200, createjs.Ease.getPowInOut(4));
    img.cursor = "pointer";
    img.addEventListener("click", handleClick);


};

GraphicsUtils.prototype.playQuickAnimation = function (img) {
    var self = this;
    var _img = img;
    var animationComplete = function () {
        createjs.Tween.get(_img, {loop: false})
            .to({y: 0, alpha: 0}, 500, createjs.Ease.getPowInOut(4))
        self.stage.removeAllEventListeners();
        self.stage.removeAllChildren();
    };

    this.adjustCanvas();

    this.stage = new createjs.Stage("canvasAnimate");
    this.stage.addChild(img);

    var bounds = img.getBounds();
    img.x = (window.innerWidth - bounds.width) / 2;
    img.y = 0;
    img.alpha = 1;

    createjs.Tween.get(img, {loop: false})
        .to({y: (window.innerHeight - bounds.height) / 2}, 1200, createjs.Ease.getPowInOut(4))
        .call(animationComplete);
    ;

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.stage);
};

GraphicsUtils.prototype.showAwesome = function () {
    this.playQuickAnimation(this.awesomeImg);
};

GraphicsUtils.prototype.showYouRock = function () {
    this.playQuickAnimation(this.rockImg);
};
