import { Component, OnInit, AfterContentInit, ViewChild, OnDestroy } from '@angular/core';

import jsQR from 'jsqr';
import { MasterService } from '../services/master.service';
import { Stages } from '../models/stages';

@Component({
  selector: 'deg-find-qr-code',
  templateUrl: './find-qr-code.component.html',
  styleUrls: ['./find-qr-code.component.scss']
})
export class FindQrCodeComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild('myCanvas') myCanvas;
  canvasRC: CanvasRenderingContext2D;

  video = document.createElement('video');
  ownStream: MediaStream = null;

  width;
  height;

  solution = 'Computas';

  constructor(private masterService: MasterService) { }

  ngOnInit() {
    console.log('oppe');
  }

  ngAfterContentInit() {

    this.canvasRC = this.myCanvas.nativeElement.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }).then(stream => {
      this.ownStream = stream;
      this.video.srcObject = stream;
      this.video.play();
      this.draw();
    },
      error => {
        console.warn('can\'t get media!');
        console.warn(error);
      });
  }

  ngOnDestroy() {
    if (this.ownStream) {
      this.ownStream.getTracks()[0].stop();
    }
  }

  draw() {

    let solved = false;

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {

      this.width = window.innerWidth;
      this.height = window.innerHeight / 1.5;


      this.myCanvas.nativeElement.width = this.width;
      this.myCanvas.nativeElement.height = this.height;

      this.drawReset();
      this.canvasRC.drawImage(this.video, 0, 0, this.width, this.height);

      const imageData = this.canvasRC.getImageData(0, 0, this.width, this.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      console.log(code);

      if (code && code.data === this.solution) {
        solved = true;
        this.masterService.gotoStage(Stages.End);
      }
    }

    requestAnimationFrame(this.draw.bind(this));
  }

  drawReset() {
    this.drawRect(0, 0, this.width, this.height, 'black');
  }

  drawRect(x, y, w, h, color: string) {
    this.canvasRC.fillStyle = color;
    this.canvasRC.fillRect(x, y, w, h);
  }

}
