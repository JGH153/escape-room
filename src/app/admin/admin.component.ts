import { Component, OnInit } from '@angular/core';
import { MasterService } from '../services/master.service';

@Component({
  selector: 'deg-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  showWinner = false;
  winnerName = 'Greger';

  constructor(private masterService: MasterService) { }

  ngOnInit() {
  }

  // Draw winner randomly from completed<br>
  // assuming less than a few hundred winners. Just read all docs and select at random?
  getRandomWinner() {
    this.masterService.getRandomWinner().subscribe({
      next: winner => {
        this.showWinner = true;
        this.winnerName = winner;
      }
    });
  }

  closeWinnerPopup() {
    this.showWinner = false;
  }

}
