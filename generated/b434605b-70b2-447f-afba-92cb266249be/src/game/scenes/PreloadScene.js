// PreloadScene — registers generated assets
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
