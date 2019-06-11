import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../services/master.service';
import { Stages } from '../models/stages';
import { AccessCardService } from './service/access-card.service';
import { timer, Subscription } from 'rxjs';
import { EmojiLikelihood } from './service/emoji-likelihood';
import { MatSnackBar } from '@angular/material/snack-bar';

// TODO auto stop image loopp after x sec

@Component({
  selector: 'deg-access-card',
  templateUrl: './access-card.component.html',
  styleUrls: ['./access-card.component.scss']
})
export class AccessCardComponent implements OnInit, AfterContentInit, OnDestroy {

  // video = document.createElement('video');
  @ViewChild('videoElement', { static: true }) video;
  ownStream: MediaStream = null;
  username;

  showIntroGeneral = true;
  showIntro = false;
  noCamera = false;
  showOutro = false;

  @ViewChild('thyImg', { static: true }) thyImg;
  @ViewChild('progressElement', { static: true }) progressElement;

  loadingResponse = false;
  tempResponse = '';
  activeEmojions = '';

  progressDeg = 360 / 2;
  noSmileTimes = 0;
  imagesChecked = 0;

  myTimer = timer(0, 30);
  timerSub: Subscription;

  constructor(
    private router: Router,
    private masterService: MasterService,
    private accessCardService: AccessCardService,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.username = this.masterService.username;
  }

  ngAfterContentInit() {
    // this.getUserMedia(); // temp
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
    if (!navigator.mediaDevices) {
      this.ifNoCamera();
    } else {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream: MediaStream) => {
        this.ownStream = stream;
        this.video.nativeElement.srcObject = stream;
      },
        error => {
          this.ifNoCamera();
          console.warn('can\'t get media!');
          console.warn(error);
        });
    }

    this.timerSub = this.myTimer.subscribe({ next: this.logicTick.bind(this) });
  }

  hasCamera() {
    return !this.noCamera;
  }

  logicTick(time) {
    this.progressDeg += 2;
    if (this.progressDeg > 360) {
      this.progressDeg = 0;

      if (this.hasCamera()) {
        this.grabImage();
      }

      // max images
      this.imagesChecked++;
      if (this.imagesChecked > 30) {
        this.timerSub.unsubscribe();
        alert('Timeout, last inn siden på nytt!');
      }
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

  setLocalImage() {
    const videoW = this.ownStream.getTracks()[0].getSettings().width;
    const videoH = this.ownStream.getTracks()[0].getSettings().height;

    const myCanvas = document.createElement('canvas');
    // myCanvas.id = 'myCanvas';
    const context = myCanvas.getContext('2d');
    myCanvas.width = videoW;
    myCanvas.height = videoH;
    context.drawImage(this.video.nativeElement, 0, 0, videoW, videoH);
    // const image = new Image();
    // / image.id = 'pic';
    this.renderer.setStyle(this.thyImg.nativeElement, 'display', 'block');
    this.thyImg.nativeElement.src = myCanvas.toDataURL();

    this.masterService.setOwnImage(myCanvas.toDataURL());
  }

  // https://developers.google.com/web/updates/2016/12/imagecapture

  grabImage() {

    this.setLocalImage();

    const videoW = this.ownStream.getTracks()[0].getSettings().width;
    const videoH = this.ownStream.getTracks()[0].getSettings().height;

    const targetWidth = 300;
    const diffFactor = videoW / targetWidth;

    const outputWidth = targetWidth;
    const outputHight = videoH / diffFactor;

    const myCanvas = document.createElement('canvas');
    // myCanvas.id = 'myCanvas';
    const context = myCanvas.getContext('2d');
    myCanvas.width = outputWidth;
    myCanvas.height = outputHight;
    context.drawImage(this.video.nativeElement, 0, 0, outputWidth, outputHight);

    const base64 = myCanvas.toDataURL().replace('data:image/png;base64,', '');

    this.loadingResponse = true;
    this.accessCardService.detectEmojions(base64).subscribe({
      next: response => this.onDetectEmojiResponse(response)
    });
  }

  onDetectEmojiResponse(response) {
    this.renderer.setStyle(this.thyImg.nativeElement, 'display', 'none');
    this.loadingResponse = false;
    this.tempResponse = response;
    if (this.accessCardService.emojiPossibleOrMore(response.joyLikelihood)) {
      this.puzzleComplete();
    } else {
      this.renderer.setStyle(this.thyImg.nativeElement, 'display', 'none');
    }
    // TODO display emjions that match somewhere
    this.activeEmojions = this.accessCardService.getActiveEmojions(response);
    if (this.activeEmojions.length === 0) {
      this.noSmileTimes++;
    }


    if (this.activeEmojions.length && (this.noSmileTimes === 3 || this.noSmileTimes === 10)) {
      this.smileHint();
    }
  }

  smileHint() {
    const durationInSeconds = 5;
    this.snackBar.open(
      'Husk å smil på bildet ditt!',
      '',
      {
        duration: durationInSeconds * 1000,
      }
    );
  }



  // sendFile(blob) {

  // }

  puzzleComplete() {
    this.showOutro = true;
    this.ownStream.getTracks()[0].stop();
    this.timerSub.unsubscribe();
  }

  closeIntro() {
    this.showIntro = false;
    this.getUserMedia();
  }

  closeIntroGeneral() {
    this.showIntro = true;
    this.showIntroGeneral = false;
  }

  // TODO use WebRTC to get image live and send to google and crop to face!

}
