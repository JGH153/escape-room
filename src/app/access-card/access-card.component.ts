import { Component, OnInit, AfterContentInit } from '@angular/core';

@Component({
  selector: 'deg-access-card',
  templateUrl: './access-card.component.html',
  styleUrls: ['./access-card.component.scss']
})
export class AccessCardComponent implements OnInit, AfterContentInit {

  ownStream = null;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
      this.ownStream = stream;
    },
      error => {
        console.warn('can\'t get media!');
        console.warn(error);
      });
  }

  // TODO use WebRTC to get image live and send to google and crop to face!

}
