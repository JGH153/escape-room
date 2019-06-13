import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy } from '@angular/core';

import * as Proton from 'proton-js/build/proton.js';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'deg-firework-effect',
  templateUrl: './firework-effect.component.html',
  styleUrls: ['./firework-effect.component.scss']
})
export class FireworkEffectComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myCanvas', { static: true }) myCanvas: ElementRef;
  canvasRC: CanvasRenderingContext2D;

  width;
  height;

  canvas;
  context;
  proton;
  renderer;
  emitter;
  stats;

  play = true;

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

  }

  main() {
    this.createProton();
    this.tick();
  }

  tick() {
    if (this.play) {
      this.proton.update();
      requestAnimationFrame(this.tick.bind(this));
    }
  }

  createProton() {
    this.proton = new Proton();
    this.emitter = new Proton.Emitter();
    this.emitter.rate = new Proton.Rate(new Proton.Span(1, 3), 1);

    this.emitter.addInitialize(new Proton.Mass(1));
    this.emitter.addInitialize(new Proton.Radius(2, 4));
    this.emitter.addInitialize(
      new Proton.P(
        new Proton.LineZone(
          10, this.myCanvas.nativeElement.height, this.myCanvas.nativeElement.width - 10, this.myCanvas.nativeElement.height)));
    this.emitter.addInitialize(new Proton.Life(1, 1.5));
    this.emitter.addInitialize(new Proton.V(new Proton.Span(4, 6), new Proton.Span(0, 0, true), 'polar'));

    this.emitter.addBehaviour(new Proton.Gravity(1));
    this.emitter.addBehaviour(new Proton.Color('#49BCA1'));
    this.emitter.emit();
    this.proton.addEmitter(this.emitter);

    this.renderer = new Proton.CanvasRenderer(this.canvas);
    this.renderer.onProtonUpdate = () => {
      this.context.fillStyle = 'rgba(0, 0, 0, 0.01)';
      this.context.fillRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);
    };
    this.proton.addRenderer(this.renderer);

    //// NOTICE :you can only use two emitters do this effect.In this demo I use more emitters want to test the emtter's life
    this.proton.addEventListener(Proton.PARTICLE_DEAD, (particle) => {
      const timerId = setTimeout(() => {
        // no vibrate in safar
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(200);
        }
      }, 50);

      if (Math.random() < .7) {
        this.createFirstEmitter(particle);
      } else {
        this.createSecondEmitter(particle);
      }
      if (!this.play) {
        clearInterval(timerId);
      }
    });
  }

  createFirstEmitter(particle) {
    const subemitter = new Proton.Emitter();
    subemitter.rate = new Proton.Rate(new Proton.Span(250, 300), 1);
    subemitter.addInitialize(new Proton.Mass(1));
    subemitter.addInitialize(new Proton.Radius(1, 2));
    subemitter.addInitialize(new Proton.Life(1, 2));
    subemitter.addInitialize(new Proton.V(new Proton.Span(2, 4), new Proton.Span(0, 360), 'polar'));

    subemitter.addBehaviour(new Proton.RandomDrift(10, 10, .05));
    subemitter.addBehaviour(new Proton.Alpha(1, 0));
    subemitter.addBehaviour(new Proton.Gravity(3));
    // const color = Proton.MathUtils.randomColor();
    subemitter.addBehaviour(new Proton.Color('#49BCA1'));

    subemitter.p.x = particle.p.x;
    subemitter.p.y = particle.p.y;
    subemitter.emit('once', true);
    this.proton.addEmitter(subemitter);
  }

  createSecondEmitter(particle) {
    const subemitter = new Proton.Emitter();
    subemitter.rate = new Proton.Rate(new Proton.Span(100, 120), 1);

    subemitter.addInitialize(new Proton.Mass(1));
    subemitter.addInitialize(new Proton.Radius(4, 8));
    subemitter.addInitialize(new Proton.Life(1, 2));
    subemitter.addInitialize(new Proton.V([1, 2], new Proton.Span(0, 360), 'polar'));

    subemitter.addBehaviour(new Proton.Alpha(1, 0));
    subemitter.addBehaviour(new Proton.Scale(1, .1));
    subemitter.addBehaviour(new Proton.Gravity(1));
    // const color = Proton.MathUtils.randomColor();
    // console.log(color);
    subemitter.addBehaviour(new Proton.Color('#49BCA1'));

    subemitter.p.x = particle.p.x;
    subemitter.p.y = particle.p.y;
    subemitter.emit('once', true);
    this.proton.addEmitter(subemitter);
  }



}
