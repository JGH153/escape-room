import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

// credit to https://css-tricks.com/snippets/css/star-wars-crawl-text/
@Component({
  selector: 'deg-game-intro',
  templateUrl: './game-intro.component.html',
  styleUrls: ['./game-intro.component.scss']
})
export class GameIntroComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas', { static: true }) myCanvas;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvasRC = this.myCanvas.nativeElement.getContext('2d');
    document.body.style.overflow = 'hidden';

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.myCanvas.nativeElement.width = width;
    this.myCanvas.nativeElement.height = height;

    for (let i = 0; i < 200; i++) {
      canvasRC.fillStyle = 'white';
      canvasRC.fillRect(this.getRandNumber(width), this.getRandNumber(height), 1, 1);
    }
  }

  getRandNumber(toRange) {
    return Math.floor(Math.random() * toRange);
  }

}
