import { Component, OnInit } from '@angular/core';
import { AutoText } from './autocode.text';
import { MasterService } from '../services/master.service';
import { Stages } from '../models/stages';

@Component({
  selector: 'deg-auto-code',
  templateUrl: './auto-code.component.html',
  styleUrls: ['./auto-code.component.scss']
})
export class AutoCodeComponent implements OnInit {

  totalText = AutoText.substr(0, 40);
  currentText = '';

  addMax = 30;
  addZero = this.addMax;
  addOne = this.addMax;
  removeEachPress = 5;

  constructor(private masterService: MasterService) { }

  ngOnInit() {
  }

  clickedButtonZero() {
    this.addOne = this.addMax;
    this.addText(this.addZero);
    this.addZero -= this.removeEachPress;
  }

  clickedButtonOne() {
    this.addZero = this.addMax;
    this.addText(this.addOne);
    this.addOne -= this.removeEachPress;
  }

  addText(toAdd) {

    if (this.currentText.length >= this.totalText.length) {
      this.gotoNextTask();
    }

    const chatsPrPress = toAdd;
    if (this.totalText.length > this.currentText.length) {
      this.currentText = this.totalText.substr(0, this.currentText.length + chatsPrPress);
    }

  }

  gotoNextTask() {
    this.masterService.gotoStage(Stages.FindQrCode);
  }

}
