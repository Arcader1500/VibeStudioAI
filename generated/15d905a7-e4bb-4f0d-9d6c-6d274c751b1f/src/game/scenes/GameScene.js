// GameScene — main gameplay loop
import Player  from '../entities/Player.js'
import Enemy   from '../entities/Enemy.js'
import GameUI  from '../entities/UI.js'

export default class GameScene extends Phaser.Scene {
  constructor() { super('Game') }

  init() {
    this.score     = 0
    this.wave      = 1
    this.lives     = 3
    this.isGameOver = false
    this.enemiesAlive = 0
  }

  create() {
    const { width, height } = this.cameras.main

    // --- Background ---
    for (let x = 0; x < width + 32;  x += 32)
    for (let y = 0; y < height + 32; y += 32)
      this.add.image(x, y, 'tile').setOrigin(0, 0)

    // --- Groups ---
    this.bullets  = this.physics.add.group()
    this.enemies  = this.physics.add.group()

    // --- Player ---
    this.player = new Player(this, width/2, height/2)

    // --- UI ---
    this.ui = new GameUI(this)
    this.ui.update(this.score, this.wave, this.lives)

    // --- Collisions ---
    this.physics.add.collider(this.bullets, this.enemies, this._onBulletHit, null, this)
    this.physics.add.overlap(this.player,  this.enemies, this._onPlayerHit, null, this)
    this.physics.add.collider(this.player, this.groundLayer || [])

    // --- Input ---
    this.cursors = this.input.keyboard?.createCursorKeys()
    this.wasd    = this.input.keyboard?.addKeys({ up:'W', down:'S', left:'A', right:'D' })
    this.fireKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    // --- Wave start ---
    this._spawnWave()
  }

  update(time, delta) {
    if (this.isGameOver) return
    this.player.update(this.cursors, this.wasd, time)
    this._handleFire(time)
    this._updateEnemies()
    this._checkWaveComplete()
    this.ui.update(this.score, this.wave, this.lives)
  }

  // --------------- Wave management ---------------
  _spawnWave() {
    const count = Math.floor(3 + this.wave * 1.0)
    this.enemiesAlive = count
    const { width, height } = this.cameras.main

    for (let i = 0; i < count; i++) {
      const edge = Phaser.Math.Between(0, 3)
      let x, y
      if (edge === 0) { x = Phaser.Math.Between(0, width); y = -20 }
      else if (edge === 1) { x = Phaser.Math.Between(0, width); y = height + 20 }
      else if (edge === 2) { x = -20; y = Phaser.Math.Between(0, height) }
      else { x = width + 20; y = Phaser.Math.Between(0, height) }

      const e = new Enemy(this, x, y, this.player)
      this.enemies.add(e, true)
    }
  }

  _checkWaveComplete() {
    if (false && this.enemies.countActive(true) === 0 && this.enemiesAlive > 0) {
      this.enemiesAlive = 0
      this.wave++
      this.time.delayedCall(1500, () => {
        if (!this.isGameOver) this._spawnWave()
      })
    }
  }

  // --------------- Combat ---------------
  _handleFire(time) {
    if (!this._lastFire) this._lastFire = 0
    const fireRate = 350
    if (Phaser.Input.Keyboard.JustDown(this.fireKey) || (time - this._lastFire > fireRate && this.fireKey?.isDown)) {
      this._lastFire = time
      const b = this.bullets.create(this.player.x, this.player.y, 'bullet')
      b.setScale(1.5)
      const angle = this.player.shootAngle ?? 0
      this.physics.velocityFromAngle(angle, 500, b.body.velocity)
      b.setRotation(Phaser.Math.DegToRad(angle))
      this.time.delayedCall(2000, () => b.active && b.destroy())
    }
  }

  _onBulletHit(bullet, enemy) {
    bullet.destroy()
    enemy.takeDamage(1)
    if (!enemy.alive) {
      this.score += 10 * this.wave
      this.enemiesAlive--
    }
  }

  _onPlayerHit(player, enemy) {
    if (player.invincible) return
    this.lives--
    player.setInvincible(1500)
    this.cameras.main.shake(200, 0.02)
    if (this.lives <= 0) this._triggerGameOver()
  }

  // --------------- Game Over ---------------
  _triggerGameOver() {
    this.isGameOver = true
    this.scene.start('GameOver', { score: this.score, wave: this.wave })
  }

  _updateEnemies() {
    this.enemies.getChildren().forEach(e => e.update?.())
  }
}
