import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.won = data.won || false;
    }

    create() {
        this.add.image(400, 300, 'background');

        const message = this.won ? 'You Win!' : 'Game Over';
        this.add.text(400, 200, message, {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.add.text(400, 300, 'Score: ' + this.finalScore, {
            fontSize: '32px',
            fill: '#ffff00',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const restartBtn = this.add.text(400, 450, 'Click to Restart', {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive();

        restartBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
