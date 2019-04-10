import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';

@Component({
  selector: 'deg-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements OnInit, AfterContentInit {

  @ViewChild('myCanvas') myCanvas;
  canvasRC: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.canvasRC = this.myCanvas.nativeElement.getContext('2d');
    this.canvasRC.beginPath();
    this.canvasRC.arc(100, 100, 50, 0, 2 * Math.PI);
    this.canvasRC.closePath();
    this.canvasRC.fill();

    const image = new Image();
    image.src = 'assets/boss.png';
    image.onload = () => {

      this.canvasRC.drawImage(image, 20, 20);
    };

  }

}
