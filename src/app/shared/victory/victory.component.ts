import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';

import * as Proton from 'proton-js/build/proton.js';

@Component({
  selector: 'deg-victory',
  templateUrl: './victory.component.html',
  styleUrls: ['./victory.component.scss']
})
export class VictoryComponent implements OnInit, AfterViewInit {

  @Input() title = '';
  @Output() closedEE = new EventEmitter<boolean>();

  @Input() effectFireworks = false;
  @Input() effectLines = false;
  @Input() effectLogo = false;

  showText = false;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.showText = true;
    }, 800);

  }

  onClickClose() {
    this.closedEE.emit(true);
  }

}
