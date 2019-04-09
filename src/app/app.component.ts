import { Component, OnInit } from '@angular/core';
import { MasterService } from './services/master.service';

@Component({
  selector: 'deg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isLoading;

  constructor(private masterService: MasterService) { }

  ngOnInit() {
    this.isLoading = this.masterService.isLoading;
  }

}
