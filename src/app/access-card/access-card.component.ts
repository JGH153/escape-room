import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'deg-access-card',
  templateUrl: './access-card.component.html',
  styleUrls: ['./access-card.component.scss']
})
export class AccessCardComponent implements OnInit, AfterContentInit {

  ownStream: MediaStream = null;

  constructor(private router: Router) { }

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

  nextPuzzle() {
    this.ownStream.getTracks()[0].stop();
    this.router.navigate(['snake']);
  }

  // TODO use WebRTC to get image live and send to google and crop to face!

}
