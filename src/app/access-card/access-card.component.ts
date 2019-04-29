import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../services/master.service';
import { Stages } from '../models/stages';

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

  @ViewChild('thyImg') thyImg;

  constructor(private router: Router, private masterService: MasterService) { }

  ngOnInit() {
    this.username = this.masterService.username;
  }

  ngAfterContentInit() {

  }

  ngOnDestroy() {
    if (this.ownStream) {
      this.ownStream.getTracks()[0].stop();
    }
  }

  getUserMedia() {
    console.log('123');
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
      console.log('jupp');
      this.ownStream = stream;
      this.video.srcObject = stream;
      this.video.play();

      setTimeout(() => {
        this.grabImage();
      }, 1500);
    },
      error => {
        console.warn('can\'t get media!');
        console.warn(error);
      });
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
  }

  nextPuzzle() {
    this.ownStream.getTracks()[0].stop();
    this.masterService.gotoStage(Stages.Snake);
  }

  closeIntro() {
    this.showIntro = false;
    this.getUserMedia();
  }

  // TODO use WebRTC to get image live and send to google and crop to face!

}
