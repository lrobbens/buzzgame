import { Component, ViewChild, OnInit } from '@angular/core';
import { Application, Texture, Graphics, RenderTexture} from 'pixi.js';
import { CollisionService } from './services/collision.service';
import { BubbleFactory } from './gameModels/bubbleFactory';

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
  animatedSprite : PIXI.extras.AnimatedSprite;
  textures : Array<PIXI.Texture> = [];
  richText : PIXI.Text;
  nbCollisions: number = 0;
  previousInCollision: boolean = false;
  count: number = 0;
  bubbleFatory :BubbleFactory;
  cpt : number = 0;
  bubbleFactory : BubbleFactory;
  graphics: PIXI.Graphics = new PIXI.Graphics();
  frames = [];

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
          if(this.animatedSprite) {
            this.animatedSprite.x = mouseposition.x;
            this.animatedSprite.y = mouseposition.y;
            this.graphics.x = mouseposition.x ;
            this.graphics.y = mouseposition.y-20;
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
        this.bubbleFactory = new BubbleFactory(this.frames);
        this.animatedSprite = this.bubbleFactory.addBubble(50,50, 0x0bbbff, .5);
        this.bubbleFactory.addBubble(100, 100, 0x00ff00, 0.6);
        this.bubbleFactory.addBubble(200,150, 0xffe6f0, .2);
        this.bubbleFactory.addBubble(300,500, 0x0ffff0, 0.4);
        this.bubbleFactory.addBubble(100,500, 0xffff66, .7);
        this.bubbleFactory.addBubble(400,400, 0x0bbbff, 0.35);
        this.bubbleFactory.addBubble(600,600, 0x800000, .5);
        this.bubbleFactory.playBubbles(this.app.stage);           
      }

      fillFrames(){
        for (var i = 0; i < 20; i++) {
          let val = i < 10 ? '00' + i : '0' + i;
          this.frames.push(PIXI.Texture.fromFrame('tile' + val + '.png'));
        }
      }
  }

    
    // 
        
  

  


