import { Component, ViewChild, OnInit } from '@angular/core';
declare var PIXI: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'buzzgame';

  @ViewChild('pixiContainer') pixiContainer;

  public app: any;

  ngOnInit() {

    this.app = new PIXI.Application({ // this creates our pixi application
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb
    });
    let bunny = new PIXI.Sprite.fromImage('/assets/bunny.jpg');
    bunny.anchor.set(0.5);
    bunny.x = this.app.screen.width / 2;
    bunny.y = this.app.screen.height / 2;
    this.app.stage.addChild(bunny);
    this.pixiContainer.nativeElement.appendChild(this.app.view); // this places our pixi application onto the viewable document
    this.app.ticker.add((delta) =>
        {bunny.rotation += 0.01 * delta;}
    ); 
  }
}
