import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'deg-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  showWinner = false;
  winnerName = 'Greger';

  constructor() { }

  ngOnInit() {
  }

  // Draw winner randomly from completed<br>
  // assuming less than a few hundred winners. Just read all docs and select at random?
  getRandomWinner() {
    this.showWinner = true;
  }

  closeWinnerPopup() {
    this.showWinner = false;
  }

}
