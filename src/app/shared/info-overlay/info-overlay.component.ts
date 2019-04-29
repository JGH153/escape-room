import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'deg-info-overlay',
  templateUrl: './info-overlay.component.html',
  styleUrls: ['./info-overlay.component.scss']
})
export class InfoOverlayComponent implements OnInit {

  @Input() title = '';
  @Input() subTitle = '';
  @Input() imageUrl = '';
  @Input() startButtonLabel = '';

  @Output() startEE = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  closeIntro() {
    this.startEE.emit(true);
  }

}
