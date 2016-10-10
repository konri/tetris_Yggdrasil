/**
 * Created by konrad Hopek
 */

function SoundsUtils() {
    this.backgroundSoundId = "backgroundSoundId";
    this.clickSoundId = "clickSoundId";
    this.clearRowId = "clearRowId";
    this.gameOverId = "gameOverId";
    this.loadSounds();
};

SoundsUtils.prototype.loadSounds = function () {
    createjs.Sound.registerSound("sound/background_sound.mp3", this.backgroundSoundId);
    createjs.Sound.registerSound("sound/clear_row.wav", this.clearRowId);
    createjs.Sound.registerSound("sound/click_brick.mp3", this.clickSoundId);
    createjs.Sound.registerSound("sound/game_over_sound.wav", this.gameOverId);

};

SoundsUtils.prototype.playBackgroundSound = function () {
    if (createjs.Sound.loadComplete(this.backgroundSoundId)) {
        var ppc = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_ANY, loop: 0, volume: 0.5});
        createjs.Sound.play(this.backgroundSoundId, ppc);
    }
};

SoundsUtils.prototype.stopBackgroundSound = function () {
    createjs.Sound.stop(this.backgroundSoundId);
};

SoundsUtils.prototype.playBrickClick = function () {
    if (createjs.Sound.loadComplete(this.clickSoundId)) {
        var ppc = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_ANY, loop: 0, volume: 0.7});
        createjs.Sound.play(this.clickSoundId, ppc);
    }
};

SoundsUtils.prototype.playClearRow = function () {
    if (createjs.Sound.loadComplete(this.clearRowId)) {
        var ppc = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_ANY, loop: 0, volume: 0.7});
        createjs.Sound.play(this.clearRowId, ppc);
    }
};

SoundsUtils.prototype.playGameOver = function () {
    if (createjs.Sound.loadComplete(this.gameOverId)) {
        var ppc = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_ANY, loop: 0, volume: 0.9});
        createjs.Sound.play(this.gameOverId, ppc);
    }
};
