import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

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
  @Input() imageData = '';

  @ViewChild('imageElement', { static: true }) imageElement;

  @Output() startEE = new EventEmitter<boolean>();

  minSecDisplayed = 1;
  numTicks = 100;
  tick = (this.minSecDisplayed * 1000) / this.numTicks;
  progress = 0;
  canClose = false;

  constructor() { }

  ngOnInit() {
    timer(3000).pipe(take(1)).subscribe({
      next: (tick) => {
        this.canClose = true;
      }
    });
    timer(0, this.tick).pipe(take(this.numTicks)).subscribe({next: (tick) => {
      this.progress += 100 / this.numTicks;
    }});
  }

  ngAfterViewInit() {
    if (this.imageData) {
      this.imageElement.nativeElement.style.cssText = '--image-url:  url("' + this.imageData + '");';
    } else {
      this.imageElement.nativeElement.style.cssText = '--image-url:  url("./../../../' + this.imageUrl + '");';
    }
  }

  closeIntro() {
    if (!this.canClose) {
      // TODO
    } else {
      this.startEE.emit(true);
    }
  }

}
