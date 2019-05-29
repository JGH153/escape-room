import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy } from '@angular/core';

import * as Proton from 'proton-js/build/proton.js';

@Component({
  selector: 'deg-dna-effect',
  templateUrl: './dna-effect.component.html',
  styleUrls: ['./dna-effect.component.scss']
})
export class DnaEffectComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myCanvas', { static: true }) myCanvas: ElementRef;
  canvasRC: CanvasRenderingContext2D;

  width;
  height;

  canvas;
  context;
  proton;
  renderer;
  emitter;
  pointZone;
  R;
  num;
  pointer;
  pos = { x: 0, y: 0 };

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

  }

  main() {
    this.num = Math.min(window.innerWidth / (1000 / 145), 400);
    console.log(this.num);
    this.R = 140;
    this.pointer = { x: 0, y: 0, r: 0 };

    this.createProton(this.num);
    this.addRenderer();
    this.tick();
    // setTimeout(this.addMouseEvent, 200);
  }

  createProton(num) {
    this.proton = new Proton();

    num = num * 1;

    this.emitter = new Proton.Emitter();
    this.emitter.rate = new Proton.Rate(new Proton.Span(num), new Proton.Span(.05, .2));

    this.emitter.addInitialize(new Proton.Mass(1));
    this.emitter.addInitialize(new Proton.Radius(1, 4));
    this.emitter.addInitialize(new Proton.Life(Infinity));

    this.pointZone = new Proton.Position(new Proton.RectZone(0, 0, this.canvas.width, this.canvas.height));
    this.emitter.addInitialize(this.pointZone);
    this.emitter.addInitialize(new Proton.Velocity(new Proton.Span(.3, .6), new Proton.Span(0, 360), 'polar'));

    this.emitter.addBehaviour(new Proton.Alpha(Proton.getSpan(0.2, .9)));
    this.emitter.addBehaviour(new Proton.Color('#ffffff'));
    this.emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, this.canvas.width, this.canvas.height), 'cross'));

    this.emitter.emit('once');
    this.emitter.damping = 0;
    this.proton.addEmitter(this.emitter);
  }

  addRenderer() {
    this.renderer = new Proton.CanvasRenderer(this.canvas);
    this.renderer.onProtonUpdateAfter = () => {
      const particles = this.emitter.particles;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pA = particles[i];
          const pB = particles[j];
          const dis = pA.p.distanceTo(pB.p);

          if (dis < this.R) {
            const alpha = (1 - dis / this.R) * .5;
            this.context.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
            this.context.beginPath();
            this.context.moveTo(pA.p.x, pA.p.y);
            this.context.lineTo(pB.p.x, pB.p.y);
            this.context.closePath();
            this.context.stroke();
          }
        }
      }
    };

    this.proton.addRenderer(this.renderer);
  }

  // addMouseEvent() {
  //   this.emitter.rate = new Proton.Rate(new Proton.Span(3), .5);
  //   this.emitter.removeInitialize(this.pointZone);

  //   this.canvas.addEventListener('mousedown', (e) => {
  //     for (let i = 0; i < 3; i++) {
  //       this.emitter.particles[i].dead = true;
  //     }

  //     setTimeout(() => {
  //       this.emitter.p.x = this.getPos(e).x;
  //       this.emitter.p.y = this.getPos(e).y;
  //       this.emitter.emit('once');
  //     }, 60);
  //   });

  //   this.canvas.addEventListener('mouseup', (e) => {
  //     this.emitter.stop();
  //   });

  //   this.canvas.addEventListener('mousemove', (e) => {
  //     const p0 = this.emitter.particles[0];
  //     p0.radius = 0;
  //     const ease = .3;

  //     p0.p.x += (this.getPos(e).x - p0.p.x) * ease;
  //     p0.p.y += (this.getPos(e).y - p0.p.y) * ease;
  //   });
  // }

getPos(e) {
  if (e.layerX !== undefined) {
    this.pos.x = e.layerX;
    this.pos.y = e.layerY;
  } else if (e.offsetX !== undefined) {
    this.pos.x = e.offsetX;
    this.pos.y = e.offsetY;
  }

  return this.pos;
}

tick() {
  if (this.play) {

    requestAnimationFrame(this.tick.bind(this));
    this.proton.update();
  }
}

}
