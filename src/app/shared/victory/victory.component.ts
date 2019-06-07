import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';

import * as Proton from 'proton-js/build/proton.js';

type Colors = 'red' | 'blue' | 'green' | 'yellow';

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
  @Input() effectDna = false;
  @Input() noSkipIntro = false;

  @Input() outroTitle = '';
  @Input() outroColor: Colors = 'green';

  @ViewChild('outroElement', { static: true }) outroElement;
  @ViewChild('imageElement', { static: true }) imageElement;

  canClose = true;

  showText = false;
  showOutroText = false;
  showEffect = true;

  constructor() { }

  ngOnInit() {
    if (this.noSkipIntro) {
      this.canClose = false;
      setTimeout(() => {
        this.canClose = true;
      }, 2000);
    }
  }

  ngAfterViewInit() {

    const bgColorCss = 'background: ' + this.getBgColor();

    setTimeout(() => {
      this.showText = true;
    }, 800);

    setTimeout(() => {
      this.outroElement.nativeElement.style.cssText = 'display: flex;' + bgColorCss;
    }, 3500);
    setTimeout(() => {
      this.showEffect = false;
    }, 5000);

    const bgImgCss = '--image-url:  url("./../../../assets/design/' + this.getImageUrlForColor() + '");';
    this.imageElement.nativeElement.style.cssText = bgImgCss;
    this.outroElement.nativeElement.style.cssText = bgColorCss;

  }

  onClickCloseEffect() {
    const bgColorCss = 'background: ' + this.getBgColor();
    this.outroElement.nativeElement.style.cssText = 'display: flex;' + bgColorCss;
    this.showEffect = false;
  }

  getImageUrlForColor() {
    if (this.outroColor === 'green') {
      return 'winGreen.png';
    }
    if (this.outroColor === 'blue') {
      return 'winBlue.png';
    }
    if (this.outroColor === 'yellow') {
      return 'winYellow.png';
    }
    if (this.outroColor === 'red') {
      return 'winRed.png';
    }

    // default for good mesure
    return 'winGreen.png';
  }

  getBgColor() {
    if (this.outroColor === 'green') {
      return '#49BCA1';
    }
    if (this.outroColor === 'blue') {
      return '#29CFF5';
    }
    if (this.outroColor === 'red') {
      return '#FF5F63';
    }
    if (this.outroColor === 'yellow') {
      return '#FED546';
    }
  }

  onClickClose() {
    if (!this.canClose) {
      return;
    }
    this.closedEE.emit(true);
  }

}
