import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.won = data.won || false;
    this.finalScore = data.score || 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#222222');
    
    const message = this.won ? 'You Win!' : 'Game Over';
    const color = this.won ? '#44ff44' : '#ff4444';
    
    this.add.text(400, 200, message, {
      fontSize: '48px',
      fill: color,
      fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    this.add.text(400, 280, 'Score: ' + this.finalScore, {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    this.add.text(400, 380, 'Press SPACE or Tap to Restart', {
      fontSize: '20px',
      fill: '#aaaaaa',
      fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
    
    this.input.once('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
