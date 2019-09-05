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

  minSecDisplayed = 2.5;
  numTicks = 10;
  tick = (this.minSecDisplayed * 1000) / this.numTicks;
  progress = 0;
  canClose = false;

  constructor() { }

  ngOnInit() {
    timer(this.minSecDisplayed * 1000).pipe(take(1)).subscribe({
      next: (tick) => {
        this.canClose = true;
      }
    });
    // const tickDuration = 400;
    // const ticsToRun = (this.minSecDisplayed * 1000) / tickDuration;
    // timer(0, tickDuration).pipe(take(ticsToRun)).subscribe({
    //   next: (tick) => {
    //     this.progress += 20;
    //   }
    // });
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
