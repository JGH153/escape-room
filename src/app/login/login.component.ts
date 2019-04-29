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
  username = '';

  constructor(private masterService: MasterService, private router: Router) { }

  ngOnInit() {
  }

  startPuzzle() {
    this.masterService.createUser(this.username);
  }

}
