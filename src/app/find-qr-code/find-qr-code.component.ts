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

  video = document.createElement('video');
  ownStream: MediaStream = null;

  width;
  height;

  solution = 'Computas';

  showIntro = true;

  constructor(private masterService: MasterService) { }

  ngOnInit() {
    console.log('oppe');
  }

  ngAfterContentInit() {

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }).then(stream => {
      this.ownStream = stream;
      this.video.srcObject = stream;
      this.video.play();
      this.lookForCode();
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

  grabImage() {
    const videoW = this.ownStream.getTracks()[0].getSettings().width;
    const videoH = this.ownStream.getTracks()[0].getSettings().height;

    const myCanvas = document.createElement('canvas');
    myCanvas.id = 'myCanvas';
    const context = myCanvas.getContext('2d');
    myCanvas.width = videoW;
    myCanvas.height = videoH;
    context.drawImage(this.video, 0, 0, videoW, videoH);

    return context.getImageData(0, 0, videoW, videoH);
  }

  lookForCode() {

    let solved = false;

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {

      const videoW = this.ownStream.getTracks()[0].getSettings().width;
      const videoH = this.ownStream.getTracks()[0].getSettings().height;

      const code = jsQR(this.grabImage().data, videoW, videoH, {
        inversionAttempts: 'dontInvert',
      });

      console.log(code);

      if (code && code.data === this.solution) {
        solved = true;
        this.masterService.gotoStage(Stages.End);
      }
    }

    if (!solved) {
      requestAnimationFrame(this.lookForCode.bind(this));
    }
  }

  drawReset() {
    this.drawRect(0, 0, this.width, this.height, 'black');
  }

  drawRect(x, y, w, h, color: string) {
    // this.canvasRC.fillStyle = color;
    // this.canvasRC.fillRect(x, y, w, h);
  }

  closeIntro() {
    this.showIntro = false;
  }

}
