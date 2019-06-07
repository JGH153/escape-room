import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'deg-info-overlay',
  templateUrl: './info-overlay.component.html',
  styleUrls: ['./info-overlay.component.scss']
})
export class InfoOverlayComponent implements OnInit, AfterViewInit {

  @Input() title = '';
  @Input() subTitle = '';
  @Input() imageUrl = '';
  @Input() startButtonLabel = '';
  @Input() buttonColor = 'blue';

  @ViewChild('imageElement', {static: true}) imageElement;

  @Output() startEE = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.imageElement.nativeElement.style.cssText = '--image-url:  url("./../../../' + this.imageUrl + '");';
  }

  closeIntro() {
    this.startEE.emit(true);
  }

}
