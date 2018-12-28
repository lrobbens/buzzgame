import { Component, ViewChild, OnInit } from '@angular/core';
import { Application } from 'pixi.js';
import { CollisionService } from './collision.service';
//import * as PIXI from 'pixi.js';

declare var PIXI: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'buzzgame';

  @ViewChild('pixiContainer') pixiContainer;

  public app: PIXI.Application;
  bunny : PIXI.Sprite;
  atlas : PIXI.Sprite;
  animatedSprite : PIXI.extras.AnimatedSprite;
  textures : Array<PIXI.Texture> = [];
  richText : PIXI.Text;
  nbCollisions: number = 0;
  previousInCollision: boolean = false;
  count: number = 0;

  constructor (private collisionService : CollisionService) {
    this.app = new PIXI.Application({ 
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x00004d,
    });


    var style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440
    });

    window.addEventListener("resize", () => {
      this.resize();
    });

    this.richText = new PIXI.Text('Collisions: ', style);
    this.richText.x = 30;
    this.richText.y = 90;
    this.bunny = PIXI.Sprite.fromImage('/assets/bunny.jpg');
    this.animeSprite();
  
    this.bunny.anchor.set(0.5);
    this.bunny.x = this.app.screen.width / 2;
    this.bunny.y = this.app.screen.height / 2;
    this.bunny.scale.set(.5,.5);
    this.bunny.tint = Math.random() * 0xFFFFFF;
    this.app.stage.addChild(this.bunny);
    this.app.stage.addChild(this.richText);
    
    this.app.ticker.add((delta) =>
        {
          var mouseposition = this.app.renderer.plugins.interaction.mouse.global;
          if(this.animatedSprite) {
            this.animatedSprite.x = mouseposition.x;
            this.animatedSprite.y = mouseposition.y;
            this.animatedSprite.rotation += delta*0.05;
          }
          this.bunny.scale.x = 1 + Math.sin(this.count) * 0.04;
          this.bunny.scale.y = 1 + Math.cos(this.count) * 0.04;
          this.count += 0.1;
          if(this.animatedSprite && this.collisionService.collide(this.animatedSprite,this.bunny)) {
            this.bunny.tint = 0xff0000;
            if(!this.previousInCollision) {
              this.nbCollisions++;
              this.richText.text = "Collisions: " + this.nbCollisions;
              this.previousInCollision = true;
            }
                
          }
          else {
            this.bunny.tint = 0xAAAAAA;
            this.previousInCollision = false;
          }
        }
    ); 

    
  }

  ngOnInit() {
    this.pixiContainer.nativeElement.appendChild(this.app.view);
  }

  resize() {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.bunny.x = this.app.screen.width / 2;
      this.bunny.y = this.app.screen.height / 2;
  }

  animeSprite() {
    var loader = PIXI.loader;
    loader
      .add('/assets/atlas.json')
      .load(this.onAssetsLoaded.bind(this));
        
  }

  onAssetsLoaded() {
    let frames = [];
        for (var i = 0; i < 20; i++) {
          let val = i < 10 ? '00' + i : '0' + i;
          frames.push(PIXI.Texture.fromFrame('tile' + val + '.png'));
        }
        this.animatedSprite = new PIXI.extras.AnimatedSprite(frames);
        this.animatedSprite.anchor.set(0.5);
        this.animatedSprite.animationSpeed = 0.5;
        // this.animatedSprite.blendMode = PIXI.BLEND_MODES.SOFT_LIGHT;
        this.animatedSprite.play();
        this.app.stage.addChild(this.animatedSprite);
  }
}
