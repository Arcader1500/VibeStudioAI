import Phaser from 'phaser';

export default class UI {
  constructor(scene) {
    this.scene = scene;
    
    this.scoreText = scene.add.text(16, 16, 'Score: 0', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'monospace'
    }).setDepth(100);
    
    this.livesText = scene.add.text(16, 40, 'Lives: ' + scene.lives, {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'monospace'
    }).setDepth(100);
  }

  updateScore(score) {
    this.scoreText.setText('Score: ' + score);
  }

  updateLives(lives) {
    this.livesText.setText('Lives: ' + lives);
  }
}
