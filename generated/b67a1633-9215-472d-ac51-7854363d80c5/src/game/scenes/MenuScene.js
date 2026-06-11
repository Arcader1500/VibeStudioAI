import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.add.image(400, 300, 'background');
        this.add.text(400, 200, 'Roll & Rotate', {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const startBtn = this.add.text(400, 400, 'Click to Start', {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive();

        startBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
