import { Component, ViewChild, OnInit } from '@angular/core';
import { Application, Texture, Graphics, RenderTexture} from 'pixi.js';
import { CollisionService } from './services/collision.service';
import { AnimatedSpriteFactory } from './gameModels/AnimateSpriteFactory';

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
  bubbleMouse : PIXI.extras.AnimatedSprite;
  textures : Array<PIXI.Texture> = [];
  richText : PIXI.Text;
  nbCollisions: number = 0;
  previousInCollision: boolean = false;
  count: number = 0;
  bubbleFatory :AnimatedSpriteFactory;
  cpt : number = 0;
  bubbleFactory : AnimatedSpriteFactory;
  graphics: PIXI.Graphics = new PIXI.Graphics();
  frames = [];
  oldScreenWidth: number = window.innerWidth;
  oldScreenHeight: number = window.innerHeight;

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
    this.graphics.beginFill(0x000077);
    this.graphics.drawCircle(0, 0, 65);
    this.graphics
    this.graphics.endFill();
    this.bunny.anchor.set(0.5);
    this.bunny.x = this.app.screen.width / 2;
    this.bunny.y = this.app.screen.height / 2;
    this.bunny.scale.set(.5,.5);
    this.bunny.tint = Math.random() * 0xFFFFFF;
    this.app.stage.addChild(this.graphics);
    this.app.stage.addChild(this.bunny);
    this.app.stage.addChild(this.richText);
    var loader = PIXI.loader;
    loader
      .add('/assets/atlas.json')
      .load(this.beginGame.bind(this));
    this.app.ticker.add((delta) =>
        {
          var mouseposition = this.app.renderer.plugins.interaction.mouse.global;
          if(this.bubbleMouse) {
            this.bubbleMouse.x = mouseposition.x;
            this.bubbleMouse.y = mouseposition.y;
            this.graphics.x = mouseposition.x ;
            this.graphics.y = mouseposition.y-20;
          }
          this.bunny.scale.x = 1 + Math.sin(this.count) * 0.04;
          this.bunny.scale.y = 1 + Math.cos(this.count) * 0.04;
          this.count += 0.1;
          if(this.bubbleMouse && this.collisionService.collide(this.bubbleMouse,this.bunny)) {
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
          if(this.bubbleFactory) this.bubbleFactory.moveRandomly(this.app.screen.width, this.app.screen.height);
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

    beginGame() {
        this.fillFrames();
        this.bubbleFactory = new AnimatedSpriteFactory(this.app.stage);
        this.bubbleMouse = this.bubbleFactory.addAnimatedSprite(this.frames, 50,50, 0x0bbbff, .5);
        this.bubbleFactory.addAnimatedSprite(this.frames, 100, 100, Math.random() * 0xFFFFFF, 0.6);
        this.bubbleFactory.addAnimatedSprite(this.frames, 200,150, Math.random() * 0xFFFFFF, .2);
        this.bubbleFactory.addAnimatedSprite(this.frames, 300,500, Math.random() * 0xFFFFFF, 0.4);
        this.bubbleFactory.addAnimatedSprite(this.frames, 100,500, Math.random() * 0xFFFFFF, .7);
        this.bubbleFactory.addAnimatedSprite(this.frames, 400,400, Math.random() * 0xFFFFFF, 0.35);
        this.bubbleFactory.addAnimatedSprite(this.frames, 600,600, Math.random() * 0xFFFFFF, .5);
        this.bubbleFactory.play(this.app.stage);           
      }

      fillFrames(){
        for (var i = 0; i < 20; i++) {
          let val = i < 10 ? '00' + i : '0' + i;
          this.frames.push(PIXI.Texture.fromFrame('tile' + val + '.png'));
        }
      }
  }

    
    // 
        
  

  


