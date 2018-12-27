import { Component, ViewChild, OnInit } from '@angular/core';
import { Application } from 'pixi.js';
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
  bunny2 : PIXI.Sprite;

  constructor () {
    this.app = new PIXI.Application({ 
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb
    });
    this.bunny = PIXI.Sprite.fromImage('/assets/bunny.jpg');
    this.bunny.anchor.set(0.5);
    this.bunny2 = new PIXI.Sprite(this.bunny.texture);
    this.bunny2.anchor.set(0.5);
    this.bunny.x = this.app.screen.width / 2;
    this.bunny.y = this.app.screen.height / 2;
    this.bunny2.x = this.app.screen.width / 2;
    this.bunny2.y = this.app.screen.height / 2;
    this.bunny2.scale.set(.5,.5);
    this.bunny2.tint = Math.random() * 0xFFFFFF;
    this.app.stage.addChild(this.bunny);
    this.app.stage.addChild(this.bunny2);
    this.app.ticker.add((delta) =>
        {
          var mouseposition = this.app.renderer.plugins.interaction.mouse.global;
          this.bunny.x = mouseposition.x;
          this.bunny.y = mouseposition.y;
          this.bunny.rotation += delta*0.02;
          if(this.collide(this.bunny,this.bunny2))
            this.bunny2.tint = 0xff0000;
          else
            this.bunny2.tint = 0xAAAAAA;
        }
    ); 

    
  }

  collide(a, b)
    {
      var ab = a.getBounds();
      var bb = b.getBounds();
      return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

  ngOnInit() {
    this.pixiContainer.nativeElement.appendChild(this.app.view);
  }
}
