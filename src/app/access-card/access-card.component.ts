import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../services/master.service';
import { Stages } from '../models/stages';

@Component({
  selector: 'deg-access-card',
  templateUrl: './access-card.component.html',
  styleUrls: ['./access-card.component.scss']
})
export class AccessCardComponent implements OnInit, AfterContentInit {

  ownStream: MediaStream = null;
  username;

  constructor(private router: Router, private masterService: MasterService) { }

  ngOnInit() {
    this.username = this.masterService.username;
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
    this.masterService.gotoStage(Stages.Snake);
  }

  // TODO use WebRTC to get image live and send to google and crop to face!

}
