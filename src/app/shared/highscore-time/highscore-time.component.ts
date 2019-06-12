import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'deg-highscore-time',
  templateUrl: './highscore-time.component.html',
  styleUrls: ['./highscore-time.component.scss']
})
export class HighscoreTimeComponent implements OnInit {

  @Input() startTime;
  @Input() endTime;
  @Input() nowTime;

  constructor() { }

  ngOnInit() {
  }

}
