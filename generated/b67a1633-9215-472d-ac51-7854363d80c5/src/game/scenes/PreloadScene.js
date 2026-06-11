import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    create() {
        // Generate textures
        // Ball
        const ballGfx = this.make.graphics({ add: false });
        ballGfx.fillStyle(0xffffff, 1);
        ballGfx.fillCircle(16, 16, 16);
        ballGfx.generateTexture('ball', 32, 32);
        ballGfx.destroy();

        // Platform
        const platGfx = this.make.graphics({ add: false });
        platGfx.fillStyle(0x888888, 1);
        platGfx.fillRect(0, 0, 64, 32);
        platGfx.lineStyle(2, 0x444444, 1);
        platGfx.strokeRect(0, 0, 64, 32);
        platGfx.generateTexture('platform', 64, 32);
        platGfx.destroy();

        // Spike
        const spikeGfx = this.make.graphics({ add: false });
        spikeGfx.fillStyle(0xff0000, 1);
        spikeGfx.fillTriangle(0, 32, 16, 0, 32, 32);
        spikeGfx.generateTexture('spike', 32, 32);
        spikeGfx.destroy();

        // Portal
        const portalGfx = this.make.graphics({ add: false });
        portalGfx.fillStyle(0x00ff00, 1);
        portalGfx.fillRect(0, 0, 48, 64);
        portalGfx.lineStyle(2, 0x00aa00, 1);
        portalGfx.strokeRect(0, 0, 48, 64);
        portalGfx.generateTexture('portal', 48, 64);
        portalGfx.destroy();

        // Coin
        const coinGfx = this.make.graphics({ add: false });
        coinGfx.fillStyle(0xffff00, 1);
        coinGfx.fillCircle(8, 8, 8);
        coinGfx.generateTexture('coin', 16, 16);
        coinGfx.destroy();

        // Background
        const bgGfx = this.make.graphics({ add: false });
        bgGfx.fillStyle(0x222244, 1);
        bgGfx.fillRect(0, 0, 800, 600);
        bgGfx.generateTexture('background', 800, 600);
        bgGfx.destroy();

        this.scene.start('MenuScene');
    }
}
