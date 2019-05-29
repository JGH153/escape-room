import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy } from '@angular/core';

import * as Proton from 'proton-js/build/proton.js';

@Component({
  selector: 'deg-lines-effect',
  templateUrl: './lines-effect.component.html',
  styleUrls: ['./lines-effect.component.scss']
})
export class LinesEffectComponent implements OnInit, AfterViewInit, OnDestroy {

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
  mousedown = true;
  attractionBehaviour;
  crossZoneBehaviour;

  play = true;

  constructor() { }

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

    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }

  }

  main() {
    this.createProton();

    this.tick();
    // window.onresize = (e) {
    //   canvas.width = window.innerWidth;
    //   canvas.height = window.innerHeight;
    //   crossZoneBehaviour.reset(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'cross');
    // }
  }

  createProton() {
    this.proton = new Proton();
    this.emitter = new Proton.Emitter();
    this.emitter.damping = 0.008;

    this.emitter.rate = new Proton.Rate(500);
    this.emitter.addInitialize(new Proton.Mass(1));
    this.emitter.addInitialize(new Proton.Radius(4));
    this.emitter.addInitialize(new Proton.Velocity(new Proton.Span(5), new Proton.Span(0, 360), 'polar'));

    this.attractionBehaviour = new Proton.Attraction({
      x: 1003 / 2,
      y: 610 / 2
    }, 0, 200);

    this.addAttractionBehaviours();
    this.crossZoneBehaviour = new Proton.CrossZone(
      new Proton.RectZone(0, 0, this.canvas.width, this.canvas.height), 'bound');
    this.emitter.addBehaviour(new Proton.Color('random'));
    this.emitter.addBehaviour(this.attractionBehaviour);
    this.emitter.addBehaviour(this.crossZoneBehaviour);
    this.emitter.addInitialize(new Proton.Life(5, 10));

    this.emitter.p.x = this.canvas.width / 2;
    this.emitter.p.y = this.canvas.height / 2;
    this.emitter.emit('once');
    this.proton.addEmitter(this.emitter);
    this.proton.addRenderer(this.createRenderer());
  }

  addAttractionBehaviours() {
    const total = 16;
    const d = 360 / total;
    const R = 230;
    for (let i = 0; i < 360; i += d) {
      const x = R * Math.cos(i * Math.PI / 180);
      const y = R * Math.sin(i * Math.PI / 180);
      this.emitter.addBehaviour(new Proton.GravityWell({
        x: x + this.canvas.width / 2,
        y: y + this.canvas.height / 2
      }, 5000, 200));
    }

    this.emitter.addBehaviour(new Proton.Repulsion({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    }, 5, 200));
  }

  createRenderer() {
    const renderer = new Proton.CustomRenderer();
    renderer.onProtonUpdate = () => {
      this.context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };

    renderer.onParticleCreated = (particle) => {
      particle.lineWidth = 1;
      particle.tha = Math.random() * Math.PI;
    };

    renderer.onParticleUpdate = (particle) => {
      particle.tha += 0.01;
      particle.lineWidth = Math.abs(Math.sin(particle.tha)) * 2 + 0.1;
      this.context.beginPath();
      this.context.strokeStyle = particle.color;
      this.context.lineWidth = particle.lineWidth;
      this.context.moveTo(particle.old.p.x, particle.old.p.y);
      this.context.lineTo(particle.p.x, particle.p.y);
      this.context.closePath();
      this.context.stroke();
    };

    return renderer;
  }

  tick() {
    if (this.play) {
      requestAnimationFrame(this.tick.bind(this));
      this.proton.update();
    }
  }

}
