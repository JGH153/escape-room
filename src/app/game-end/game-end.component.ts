import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'deg-game-end',
  templateUrl: './game-end.component.html',
  styleUrls: ['./game-end.component.scss']
})
export class GameEndComponent implements OnInit {

  showIntro = true;

  constructor() { }

  ngOnInit() {
  }

  closeIntro() {
    this.showIntro = false;
  }

}
