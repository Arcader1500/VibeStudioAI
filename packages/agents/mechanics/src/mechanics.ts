/**
 * Mechanics Agent — Phaser 3 Code Generator
 * Implements SRS FR-5, §7.2
 *
 * Generates all gameplay source files for a Phaser 3 browser game:
 *   - game.js        (Phaser config + boot)
 *   - scenes/*.js    (Boot, Preload, Menu, Game, GameOver scenes)
 *   - entities/*.js  (Player, Enemy, UI)
 */

import type { ProjectBlueprint } from '../../director/src/schema.js'

export interface GeneratedFile {
  path: string      // relative to project src/game/
  content: string
}

export interface MechanicsOutput {
  files: GeneratedFile[]
  dependencies: Record<string, string>  // npm deps to add to game package.json
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

export function generateMechanics(blueprint: ProjectBlueprint): MechanicsOutput {
  const { gameplay, controls } = blueprint
  const { genre, camera, difficulty } = gameplay

  const files: GeneratedFile[] = [
    { path: 'game.js',              content: generateGameConfig(blueprint) },
    { path: 'scenes/BootScene.js',  content: generateBootScene() },
    { path: 'scenes/PreloadScene.js', content: generatePreloadScene(blueprint) },
    { path: 'scenes/MenuScene.js',  content: generateMenuScene(blueprint) },
    { path: 'scenes/GameScene.js',  content: generateGameScene(blueprint) },
    { path: 'scenes/GameOverScene.js', content: generateGameOverScene(blueprint) },
    { path: 'entities/Player.js',   content: generatePlayer(blueprint) },
    { path: 'entities/Enemy.js',    content: generateEnemy(blueprint) },
    { path: 'entities/UI.js',       content: generateUI(blueprint) },
  ]

  return {
    files,
    dependencies: { phaser: '^3.80.1' },
  }
}

// ---------------------------------------------------------------------------
// game.js — Phaser config (FR-5: game loop)
// ---------------------------------------------------------------------------

function generateGameConfig(bp: ProjectBlueprint): string {
  const width = 800
  const height = 600
  return `// VibeStudio AI — Generated Game Configuration
// Blueprint: ${bp.title}
import BootScene    from './scenes/BootScene.js'
import PreloadScene from './scenes/PreloadScene.js'
import MenuScene    from './scenes/MenuScene.js'
import GameScene    from './scenes/GameScene.js'
import GameOverScene from './scenes/GameOverScene.js'

const config = {
  type: Phaser.AUTO,
  width: ${width},
  height: ${height},
  parent: 'game-container',
  backgroundColor: '#0a0a12',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: ${bp.gameplay.camera === 'side_scroller' ? 600 : 0} },
      debug: false,
    },
  },
  scene: [BootScene, PreloadScene, MenuScene, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  audio: {
    disableWebAudio: false,
  },
}

export default new Phaser.Game(config)
`
}

// ---------------------------------------------------------------------------
// BootScene.js
// ---------------------------------------------------------------------------

function generateBootScene(): string {
  return `// BootScene — initializes game settings
export default class BootScene extends Phaser.Scene {
  constructor() { super('Boot') }

  preload() {
    // Load minimal loading screen assets if needed
  }

  create() {
    this.scene.start('Preload')
  }
}
`
}

// ---------------------------------------------------------------------------
// PreloadScene.js — asset registration (FR-5)
// ---------------------------------------------------------------------------

function generatePreloadScene(bp: ProjectBlueprint): string {
  return `// PreloadScene — registers generated assets
export default class PreloadScene extends Phaser.Scene {
  constructor() { super('Preload') }

  preload() {
    // Loading bar
    const { width, height } = this.cameras.main
    const bar   = this.add.graphics()
    const track = this.add.graphics()
    track.fillStyle(0x222235, 1)
    track.fillRect(width/2 - 160, height/2 - 8, 320, 16)
    this.load.on('progress', (v) => {
      bar.clear()
      bar.fillStyle(0x4f6ef7, 1)
      bar.fillRect(width/2 - 160, height/2 - 8, 320 * v, 16)
    })

    // Assets are registered by the Asset Agent at runtime
    // Each asset is a generated texture key → data URI or canvas texture
    this.load.on('complete', () => { bar.destroy(); track.destroy() })
  }

  create() {
    // Generate procedural textures for pixel sprites
    this._generateTextures()
    this.scene.start('Menu')
  }

  _generateTextures() {
    // Player — 16×16 pixel sprite drawn on canvas
    const pg = this.make.graphics({ x: 0, y: 0, add: false })
    pg.fillStyle(0x4f6ef7);  pg.fillRect(5, 0, 6, 4)   // head
    pg.fillStyle(0x7090fb);  pg.fillRect(3, 4, 10, 6)  // body
    pg.fillStyle(0x4f6ef7);  pg.fillRect(2, 10, 4, 6)  // leg L
    pg.fillStyle(0x4f6ef7);  pg.fillRect(10, 10, 4, 6) // leg R
    pg.generateTexture('player', 16, 16); pg.destroy()

    // Enemy — 16×16
    const eg = this.make.graphics({ x: 0, y: 0, add: false })
    eg.fillStyle(0xf87171);  eg.fillRect(3, 0, 10, 8)  // body
    eg.fillStyle(0xfca5a5);  eg.fillRect(0, 8, 4, 8)   // leg L
    eg.fillStyle(0xfca5a5);  eg.fillRect(12, 8, 4, 8)  // leg R
    eg.generateTexture('enemy', 16, 16); eg.destroy()

    // Bullet — 6×6
    const bg = this.make.graphics({ x: 0, y: 0, add: false })
    bg.fillStyle(0xfbbf24); bg.fillRect(1, 1, 4, 4)
    bg.generateTexture('bullet', 6, 6); bg.destroy()

    // Tile — 32×32 floor tile
    const tg = this.make.graphics({ x: 0, y: 0, add: false })
    tg.fillStyle(0x191b28); tg.fillRect(0, 0, 32, 32)
    tg.lineStyle(1, 0xffffff, 0.04)
    tg.strokeRect(0, 0, 32, 32)
    tg.generateTexture('tile', 32, 32); tg.destroy()
  }
}
`
}

// ---------------------------------------------------------------------------
// MenuScene.js
// ---------------------------------------------------------------------------

function generateMenuScene(bp: ProjectBlueprint): string {
  return `// MenuScene — start screen
export default class MenuScene extends Phaser.Scene {
  constructor() { super('Menu') }

  create() {
    const { width, height } = this.cameras.main

    // Background tiles
    for (let x = 0; x < width;  x += 32)
    for (let y = 0; y < height; y += 32)
      this.add.image(x, y, 'tile').setOrigin(0, 0)

    // Title
    this.add.text(width/2, height/3, '${bp.title.toUpperCase()}', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#4f6ef7',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.add.text(width/2, height/3 + 50, '${bp.genre.replace(/_/g,' ').toUpperCase()} • ${bp.gameplay.difficulty.toUpperCase()}', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff60',
    }).setOrigin(0.5)

    // Start prompt
    const startText = this.add.text(width/2, height * 0.65, 'PRESS SPACE TO START', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5)

    // Blink
    this.tweens.add({ targets: startText, alpha: 0, duration: 600, yoyo: true, repeat: -1 })

    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('Game'))
    this.input.once('pointerdown', () => this.scene.start('Game'))
  }
}
`
}

// ---------------------------------------------------------------------------
// GameScene.js — main gameplay (FR-5: game loop, physics, combat, input)
// ---------------------------------------------------------------------------

function generateGameScene(bp: ProjectBlueprint): string {
  const isTopDown     = bp.gameplay.camera === 'top_down'
  const isSideScroll  = bp.gameplay.camera === 'side_scroller'
  const diffMulti     = bp.gameplay.difficulty === 'easy' ? 0.6 : bp.gameplay.difficulty === 'hard' ? 1.5 : 1.0
  const waveBase      = bp.gameplay.waveBased ?? true
  const playerLives   = bp.gameplay.playerLives ?? 3

  return `// GameScene — main gameplay loop
import Player  from '../entities/Player.js'
import Enemy   from '../entities/Enemy.js'
import GameUI  from '../entities/UI.js'

export default class GameScene extends Phaser.Scene {
  constructor() { super('Game') }

  init() {
    this.score     = 0
    this.wave      = 1
    this.lives     = ${playerLives}
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
    ${isSideScroll ? 'this.physics.add.collider(this.player, this.groundLayer || [])' : ''}

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
    const count = Math.floor(3 + this.wave * ${diffMulti.toFixed(1)})
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
    if (${waveBase} && this.enemies.countActive(true) === 0 && this.enemiesAlive > 0) {
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
`
}

// ---------------------------------------------------------------------------
// GameOverScene.js
// ---------------------------------------------------------------------------

function generateGameOverScene(bp: ProjectBlueprint): string {
  return `// GameOverScene — end screen with score
export default class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver') }

  init(data) {
    this.finalScore = data.score ?? 0
    this.finalWave  = data.wave  ?? 1
  }

  create() {
    const { width, height } = this.cameras.main

    this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8)

    this.add.text(width/2, height/3, 'GAME OVER', {
      fontFamily: 'monospace', fontSize: '48px',
      color: '#f87171', stroke: '#000', strokeThickness: 6,
    }).setOrigin(0.5)

    this.add.text(width/2, height/2, \`Score: \${this.finalScore}   Wave: \${this.finalWave}\`, {
      fontFamily: 'monospace', fontSize: '20px', color: '#ffffff',
    }).setOrigin(0.5)

    const restart = this.add.text(width/2, height * 0.7, '[ PLAY AGAIN ]', {
      fontFamily: 'monospace', fontSize: '18px', color: '#4f6ef7',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    restart.on('pointerover',  () => restart.setColor('#7090fb'))
    restart.on('pointerout',   () => restart.setColor('#4f6ef7'))
    restart.on('pointerdown',  () => this.scene.start('Game'))
    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('Game'))
  }
}
`
}

// ---------------------------------------------------------------------------
// entities/Player.js (FR-5: physics, input handling)
// ---------------------------------------------------------------------------

function generatePlayer(bp: ProjectBlueprint): string {
  const speed = bp.gameplay.difficulty === 'easy' ? 200 : bp.gameplay.difficulty === 'hard' ? 140 : 175
  const isTopDown = bp.gameplay.camera !== 'side_scroller'

  return `// Player entity
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setScale(2).setDepth(10)
    this.setCollideWorldBounds(true)
    this.body.setSize(12, 14).setOffset(2, 2)

    this.speed = ${speed}
    this.invincible = false
    this.shootAngle = 0
  }

  update(cursors, wasd, time) {
    const left  = cursors?.left.isDown  || wasd?.left.isDown
    const right = cursors?.right.isDown || wasd?.right.isDown
    const up    = cursors?.up.isDown    || wasd?.up.isDown
    const down  = cursors?.down.isDown  || wasd?.down.isDown

    this.setVelocity(0)

    ${isTopDown ? `
    if (left)  this.setVelocityX(-this.speed)
    if (right) this.setVelocityX( this.speed)
    if (up)    this.setVelocityY(-this.speed)
    if (down)  this.setVelocityY( this.speed)

    // Diagonal normalization
    if ((left || right) && (up || down))
      this.body.velocity.normalize().scale(this.speed)

    // Face mouse / shoot direction
    const pointer = this.scene.input.activePointer
    const cam     = this.scene.cameras.main
    const wx      = pointer.x + cam.scrollX
    const wy      = pointer.y + cam.scrollY
    this.shootAngle = Phaser.Math.Angle.Between(this.x, this.y, wx, wy) * (180/Math.PI)
    this.setRotation(Phaser.Math.DegToRad(this.shootAngle))
    ` : `
    if (left)  this.setVelocityX(-this.speed)
    if (right) this.setVelocityX( this.speed)
    if (up && this.body.touching.down) this.setVelocityY(-400)  // jump
    this.shootAngle = right || (!left && !right) ? 0 : 180
    `}
  }

  setInvincible(duration) {
    this.invincible = true
    this.setAlpha(0.4)
    this.scene.time.delayedCall(duration, () => {
      this.invincible = false
      this.setAlpha(1)
    })
  }
}
`
}

// ---------------------------------------------------------------------------
// entities/Enemy.js (FR-5: combat)
// ---------------------------------------------------------------------------

function generateEnemy(bp: ProjectBlueprint): string {
  const speed = bp.gameplay.difficulty === 'easy' ? 60 : bp.gameplay.difficulty === 'hard' ? 110 : 80
  const hp    = bp.gameplay.difficulty === 'easy' ? 1  : bp.gameplay.difficulty === 'hard' ? 3   : 2

  return `// Enemy entity
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, target) {
    super(scene, x, y, 'enemy')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setScale(2).setDepth(9)

    this.hp     = ${hp}
    this.speed  = ${speed}
    this.target = target
    this.alive  = true
    this.setCollideWorldBounds(true)
  }

  update() {
    if (!this.alive || !this.target?.active) return
    this.scene.physics.moveToObject(this, this.target, this.speed)
  }

  takeDamage(amount) {
    this.hp -= amount
    this.setTint(0xffffff)
    this.scene.time.delayedCall(80, () => this.setTint(0xf87171))
    if (this.hp <= 0) {
      this.alive = false
      this.destroy()
    }
  }
}
`
}

// ---------------------------------------------------------------------------
// entities/UI.js (FR-5: UI logic)
// ---------------------------------------------------------------------------

function generateUI(bp: ProjectBlueprint): string {
  return `// GameUI — HUD overlay
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
    this.scoreText.setText(\`SCORE: \${score}\`)
    this.waveText.setText(\`WAVE \${wave}\`)
    this.livesText.setText('♥'.repeat(Math.max(0, lives)))
  }
}
`
}
