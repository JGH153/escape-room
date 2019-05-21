import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../services/master.service';
import { Stages } from '../models/stages';
import { AccessCardService } from './service/access-card.service';
import { timer, Subscription } from 'rxjs';
import { EmojiLikelihood } from './service/emoji-likelihood';

@Component({
  selector: 'deg-access-card',
  templateUrl: './access-card.component.html',
  styleUrls: ['./access-card.component.scss']
})
export class AccessCardComponent implements OnInit, AfterContentInit, OnDestroy {

  video = document.createElement('video');
  ownStream: MediaStream = null;
  username;

  showIntro = true;
  noCamera = true; // set to false TODO
  showOutro = false;

  @ViewChild('thyImg') thyImg;
  @ViewChild('progressElement') progressElement;

  tempResponse = '';

  progressDeg = 360 / 2;

  myTimer = timer(0, 30);
  timerSub: Subscription;

  constructor(
    private router: Router,
    private masterService: MasterService,
    private accessCardService: AccessCardService
  ) { }

  ngOnInit() {
    this.username = this.masterService.username;
  }

  ngAfterContentInit() {

  }

  ngOnDestroy() {
    if (this.ownStream) {
      this.ownStream.getTracks()[0].stop();
    }
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }

  getUserMedia() {
    console.log(navigator.mediaDevices);
    if (!navigator.mediaDevices) {
      this.ifNoCamera();
    } else {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
        this.ownStream = stream;
        this.video.srcObject = stream;
        this.video.play();

        // setTimeout(() => {
        //   this.grabImage();
        // }, 500);
      },
        error => {
          console.warn('can\'t get media!');
          console.warn(error);
        });
    }

    this.timerSub = this.myTimer.subscribe({ next: this.logicTick.bind(this) });
  }

  logicTick(time) {
    this.progressDeg += 1;
    if (this.progressDeg > 360) {
      this.progressDeg = 0;
      this.grabImage();
    }
    const progressDegText = this.progressDeg + 'deg';
    this.progressElement.nativeElement.style.cssText = '--progress-deg:' + progressDegText + ';';
  }

  ifNoCamera() {
    this.noCamera = true;
    alert('Du har ikke noe kamera :(');
  }

  gotoNextTask() {
    this.masterService.gotoStage(Stages.Snake);
  }

  // https://developers.google.com/web/updates/2016/12/imagecapture

  grabImage() {
    const videoW = this.ownStream.getTracks()[0].getSettings().width;
    const videoH = this.ownStream.getTracks()[0].getSettings().height;

    const myCanvas = document.createElement('canvas');
    myCanvas.id = 'myCanvas';
    const context = myCanvas.getContext('2d');
    myCanvas.width = videoW;
    myCanvas.height = videoH;
    context.drawImage(this.video, 0, 0, videoW, videoH);
    // const image = new Image();
    // image.id = 'pic';
    this.thyImg.nativeElement.src = myCanvas.toDataURL();
    // document.body.appendChild(image);
    // console.log(image);

    // myCanvas.toBlob(this.sendFile.bind(this), 'image/jpeg');

    const base64 = myCanvas.toDataURL().replace('data:image/png;base64,', '');
    console.log(base64);

    this.accessCardService.detectEmojions(base64).subscribe({
      next: response => {
        console.log('response', response);
        this.tempResponse = response;
        if (response.joyLikelihood === EmojiLikelihood.LIKELY
          || response.joyLikelihood === EmojiLikelihood.VERY_LIKELY
          || response.joyLikelihood === EmojiLikelihood.POSSIBLE) {
            this.puzzleComplete();
        }
        // TODO display emjions that match somewhere
      }
    });
  }

  // sendFile(blob) {

  // }

  puzzleComplete() {
    this.showOutro = true;
    this.ownStream.getTracks()[0].stop();
  }

  closeIntro() {
    this.showIntro = false;
    this.getUserMedia();
  }

  // TODO use WebRTC to get image live and send to google and crop to face!

}
