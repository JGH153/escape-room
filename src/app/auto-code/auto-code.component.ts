import { Component, OnInit, ViewChild } from '@angular/core';
import { AutoText } from './autocode.text';
import { MasterService } from '../services/master.service';
import { Stages } from '../models/stages';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'deg-auto-code',
  templateUrl: './auto-code.component.html',
  styleUrls: ['./auto-code.component.scss']
})
export class AutoCodeComponent implements OnInit {

  totalText; // .substr(0, 40);
  currentText = '';
  displayText;

  addMax = 80;
  addZero = this.addMax;
  addOne = this.addMax;
  removeEachPress = 0;

  showIntro = true;
  showOutro = false;
  codeDone = false;

  @ViewChild('codeElement', { static: true }) codeElement;

  constructor(private masterService: MasterService, private sanitized: DomSanitizer) { }

  ngOnInit() {
    this.totalText = AutoText.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  puzzleCompleted() {
    this.showOutro = true;
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
      this.codeDone = true;
    }

    const chatsPrPress = toAdd;
    if (this.totalText.length > this.currentText.length) {
      this.currentText = this.totalText.substr(0, this.currentText.length + chatsPrPress);
    }

    this.displayText = this.sanitized.bypassSecurityTrustHtml(this.currentText);
    requestAnimationFrame(() => {
      this.codeElement.nativeElement.scrollTop = 1000000;
    });

  }

  runCode() {
    this.puzzleCompleted();
  }

  gotoNextTask() {
    this.masterService.gotoStage(Stages.Memory);
  }

  closeIntro() {
    this.showIntro = false;
  }

}
