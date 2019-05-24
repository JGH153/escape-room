import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'deg-game-end',
  templateUrl: './game-end.component.html',
  styleUrls: ['./game-end.component.scss']
})
export class GameEndComponent implements OnInit {

  showIntro = false;
  showOutro = false;

  canShare = false;

  constructor() {
    if ((navigator as any).share) {
      this.canShare = true;
    } else {
      console.log('no share for you');
    }
  }

  ngOnInit() {
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
