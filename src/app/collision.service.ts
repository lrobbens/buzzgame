import { Injectable } from '@angular/core';
import { Application, Sprite } from 'pixi.js';


@Injectable({
  providedIn: 'root'
})
export class CollisionService {

  constructor() { }

  collide(a: Sprite, b: Sprite) {
    const ab = a.getBounds();
    const bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
  }
      
}


