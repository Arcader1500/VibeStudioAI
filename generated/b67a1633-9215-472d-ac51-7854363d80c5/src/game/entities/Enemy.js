import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'spike');

        scene.add.existing(this);
        scene.physics.add.existing(this, true); // static
        this.body.setAllowGravity(false);
    }
}
