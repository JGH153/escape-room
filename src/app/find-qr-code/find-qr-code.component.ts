import { Component, OnInit, AfterContentInit, ViewChild, OnDestroy } from '@angular/core';

import jsQR from 'jsqr';
import { MasterService } from '../services/master.service';
import { Stages } from '../models/stages';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'deg-find-qr-code',
  templateUrl: './find-qr-code.component.html',
  styleUrls: ['./find-qr-code.component.scss']
})
export class FindQrCodeComponent implements OnInit, AfterContentInit, OnDestroy {

  // video = document.createElement('video');
  @ViewChild('videoElement', { static: true }) video;
  ownStream: MediaStream = null;

  width;
  height;

  solution = 'https://compcode.computas.com/';

  showIntro = true;

  constructor(private masterService: MasterService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    // this.getUserMedia(); // temp!
  }

  ngOnDestroy() {
    if (this.ownStream) {
      this.ownStream.getTracks()[0].stop();
    }
  }

  getUserMedia() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }).then(stream => {
      this.ownStream = stream;
      this.video.nativeElement.srcObject = stream;
      this.lookForCode();
    },
      error => {
        console.warn('can\'t get media!');
        console.warn(error);
      });
  }

  grabImage() {
    const videoW = this.ownStream.getTracks()[0].getSettings().width;
    const videoH = this.ownStream.getTracks()[0].getSettings().height;

    const myCanvas = document.createElement('canvas');
    myCanvas.id = 'myCanvas';
    const context = myCanvas.getContext('2d');
    myCanvas.width = videoW;
    myCanvas.height = videoH;
    context.drawImage(this.video.nativeElement, 0, 0, videoW, videoH);

    return context.getImageData(0, 0, videoW, videoH);
  }

  lookForCode() {

    let solved = false;

    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {

      const videoW = this.ownStream.getTracks()[0].getSettings().width;
      const videoH = this.ownStream.getTracks()[0].getSettings().height;

      const code = jsQR(this.grabImage().data, videoW, videoH, {
        inversionAttempts: 'dontInvert',
      });

      console.log(code);

      if (code && code.data === this.solution) {
        solved = true;
        this.masterService.completeGame();
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
    this.getUserMedia();
  }

  qrClicked() {
    // TEMP
    // this.masterService.gotoStage(Stages.End);

    const durationInSeconds = 3;
    this.snackBar.open(
      'tips! Du finner kanskje koden der du startet...',
      '',
      {
        duration: durationInSeconds * 1000,
      }
    );

  }

}
