import { Component, OnInit, Input, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { Stages } from 'src/app/models/stages';

@Component({
  selector: 'deg-highscore-line',
  templateUrl: './highscore-line.component.html',
  styleUrls: ['./highscore-line.component.scss']
})
export class HighscoreLineComponent implements OnInit, AfterContentInit {

  @ViewChild('lineElement', { static: true }) line: ElementRef;
  @Input() name: string;
  @Input() stage: Stages;

  constructor() { }

  ngOnInit() {
    console.log('re-done');
    // setInterval(() => {
    //   this.stage++;
    //   console.log(this.stage);
    // }, 1000);
  }

  ngAfterContentInit() {
    this.line.nativeElement.style.setProperty('--bar-width', this.getPrecentageProgress());
  }

  getPrecentageProgress() {
    console.log(this.stage);
    if (this.stage === Stages.Login) {
      return '1%';
    }
    if (this.stage === Stages.AccessCard) {
      return '17%';
    }
    if (this.stage === Stages.Snake) {
      return '33%';
    }
    if (this.stage === Stages.Memory) {
      return '50%';
    }
    if (this.stage === Stages.Autocode) {
      return '67%';
    }
    if (this.stage === Stages.FindQrCode) {
      return '83%';
    }
    if (this.stage === Stages.End) {
      return '100%';
    }
    return 'Ukjent';
  }

}
