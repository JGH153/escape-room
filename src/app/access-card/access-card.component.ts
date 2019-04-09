import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'deg-access-card',
  templateUrl: './access-card.component.html',
  styleUrls: ['./access-card.component.scss']
})
export class AccessCardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // TODO use WebRTC to get image live and send to google and crop to face!

}
