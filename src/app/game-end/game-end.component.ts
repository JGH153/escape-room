import { Component, OnInit } from '@angular/core';
import { MasterService } from '../services/master.service';

@Component({
  selector: 'deg-game-end',
  templateUrl: './game-end.component.html',
  styleUrls: ['./game-end.component.scss']
})
export class GameEndComponent implements OnInit {

  showIntro = true;
  showOutro = false;

  canShare = false;

  startTime;

  imageData;

  username;

  constructor(private masterService: MasterService) {
    if ((navigator as any).share) {
      this.canShare = true;
    } else {
      console.log('no share for you');
    }
  }

  ngOnInit() {
    this.startTime = this.masterService.getStartTime();
    this.imageData = this.masterService.ownImageDataUrl;
    this.username = this.masterService.username;
  }

  closeIntro() {
    this.showIntro = false;
    this.showOutro = true;
  }

  closeOutro() {
    this.showOutro = false;
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
          title: 'Digital Escape Room',
          text: 'Compete and win prices!',
          url: 'https://digitalescaperoom2019.firebaseapp.com/',
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
  }

}
