// GameUI — HUD overlay
export default class GameUI {
  constructor(scene) {
    this.scene = scene
    const { width } = scene.cameras.main

    this.scoreText = scene.add.text(12, 12, 'SCORE: 0', {
      fontFamily: 'monospace', fontSize: '14px', color: '#ffffff',
    }).setScrollFactor(0).setDepth(100)

    this.waveText = scene.add.text(width/2, 12, 'WAVE 1', {
      fontFamily: 'monospace', fontSize: '14px', color: '#4f6ef7',
    }).setScrollFactor(0).setDepth(100).setOrigin(0.5, 0)

    this.livesText = scene.add.text(width - 12, 12, '♥♥♥', {
      fontFamily: 'monospace', fontSize: '16px', color: '#f87171',
    }).setScrollFactor(0).setDepth(100).setOrigin(1, 0)
  }

  update(score, wave, lives) {
    this.scoreText.setText(`SCORE: ${score}`)
    this.waveText.setText(`WAVE ${wave}`)
    this.livesText.setText('♥'.repeat(Math.max(0, lives)))
  }
}
