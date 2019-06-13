import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy } from '@angular/core';

import * as Proton from 'proton-js/build/proton.js';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'deg-confetti-effect',
  templateUrl: './confetti-effect.component.html',
  styleUrls: ['./confetti-effect.component.scss']
})
export class ConfettiEffectComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myCanvas', { static: true }) myCanvas: ElementRef;
  canvasRC: CanvasRenderingContext2D;
  play = true;

  width;
  height;

  canvas;
  context;
  proton;
  renderer;
  emitter;
  stats;

  constructor(private masterService: MasterService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.play = false;
  }

  ngAfterViewInit() {

    this.canvas = this.myCanvas.nativeElement;
    this.canvasRC = this.myCanvas.nativeElement.getContext('2d');
    this.context = this.myCanvas.nativeElement.getContext('2d');

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.myCanvas.nativeElement.width = this.width;
    this.myCanvas.nativeElement.height = this.height;

    this.main();

    setTimeout(() => {
      this.emitter.addInitialize(new Proton.Life(0, 0));
    }, 3500);

  }

  main() {
    this.createProton();
    this.tick();
    window.onresize = (e) => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.emitter.p.x = this.canvas.width / 2;
      this.emitter.p.y = this.canvas.height / 2;
    };
  }

  createProton() {
    this.proton = new Proton();
    this.emitter = new Proton.Emitter();
    this.emitter.rate = new Proton.Rate(new Proton.Span(10, 20), new Proton.Span(.1, .25));
    this.emitter.addInitialize(new Proton.Mass(1));
    this.emitter.addInitialize(new Proton.Radius(1, 12));
    this.emitter.addInitialize(new Proton.Life(2, 4));
    this.emitter.addInitialize(new Proton.Velocity(new Proton.Span(2, 4), new Proton.Span(-30, 30), 'polar'));
    this.emitter.addBehaviour(new Proton.RandomDrift(30, 30, .05));
    this.emitter.addBehaviour(new Proton.Color('#FED546'));
    this.emitter.addBehaviour(new Proton.Scale(1, 0.7));
    this.emitter.p.x = this.canvas.width / 2;
    this.emitter.p.y = this.canvas.height / 4;
    this.emitter.emit();

    this.proton.addEmitter(this.emitter);

    this.renderer = new Proton.CanvasRenderer(this.canvas);
    this.renderer.onProtonUpdate = () => {
      this.context.fillStyle = 'rgba(0, 0, 0, 0.1)';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };

    this.proton.addRenderer(this.renderer);
  }

  tick() {
    this.emitter.rotation = Math.floor(Math.random() * 360);
    this.proton.update();

    if (this.play) {
      requestAnimationFrame(this.tick.bind(this));
    }
  }

}
