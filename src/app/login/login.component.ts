import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MasterService } from '../services/master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'deg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  hasApprovedImg = false;
  wantComic = false;
  username = '';

  isWindows = (navigator.appVersion.indexOf('Win') !== -1);

  constructor(private masterService: MasterService, private router: Router) { }

  ngOnInit() {
  }

  startPuzzle() {
    this.masterService.createUser(this.username);
  }

  comicCheckToggle() {
    this.wantComic = !this.wantComic;
    if (this.wantComic) {
      document.documentElement.style.setProperty('--font', `"Comic Sans MS", cursive, sans-serif`);
    } else {
      document.documentElement.style.setProperty('--font', `"Open Sans", sans-serif`);
    }
  }

  whoMadeIt() {
    alert(`Laget av:
Jan Greger Hemb
Hilde Iren Breivik
Charlotte Jenssen
Caroline Helmersen
John Sætrang
Marcus Wærsted Skogsaas
    `);
  }

}
