import { Texture } from 'pixi.js';
import { Inject } from '@angular/core';
import { stagger } from '@angular/animations';

declare var PIXI: any;


export class AnimatedSpriteFactory {
    animatedSprites: PIXI.extras.AnimatedSprite [] = [];
    frames: PIXI.Texture [];
    cpt: number = 0;
    stage: PIXI.Container;

    constructor(stage : PIXI.Container) {
        this.stage = stage;
    }  
    
    addAnimatedSprite(frames: PIXI.Texture[], x: number, y: number, color: number, speed: number): PIXI.extras.AnimatedSprite {
        var animatedSprite = new PIXI.extras.AnimatedSprite(frames);
        animatedSprite.anchor.set(0.5);
        animatedSprite.animationSpeed = speed;
        animatedSprite.x = x;
        animatedSprite.y = y;
        animatedSprite.play();
        animatedSprite.tint = color;
        this.animatedSprites.push(animatedSprite);
        return animatedSprite;
    }

    play(stage : PIXI.Container) {
        this.animatedSprites.forEach( bubble => {
            bubble.play();
            this.stage.addChild(bubble);
        })
    }

    moveRandomly(screenWidth: number, screenHeight: number) {
        this.animatedSprites.forEach( bubble => {
            let signX = Math.pow(-1,Math.round(Math.random()*10));
            let signY = Math.pow(-1,Math.round(Math.random()*10));
            if(bubble.x + signX * 5 < screenWidth)
                bubble.x += signX * 5;
            if(bubble.x + signY * 5 < screenHeight)
                bubble.y += signY * 5;
        })
    }
}
