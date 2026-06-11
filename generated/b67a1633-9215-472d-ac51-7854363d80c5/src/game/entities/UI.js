import Phaser from 'phaser';

export default class UI {
    constructor(scene) {
        this.scene = scene;

        this.scoreText = scene.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setScrollFactor(0).setDepth(10);

        this.livesText = scene.add.text(16, 48, 'Lives: 3', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setScrollFactor(0).setDepth(10);
    }

    updateScore(score) {
        this.scoreText.setText('Score: ' + score);
    }

    updateLives(lives) {
        this.livesText.setText('Lives: ' + lives);
    }
}
