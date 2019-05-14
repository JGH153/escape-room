import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy } from '@angular/core';

import * as Proton from 'proton-js/build/proton.js';

@Component({
  selector: 'deg-logo-effect',
  templateUrl: './logo-effect.component.html',
  styleUrls: ['./logo-effect.component.scss']
})
export class LogoEffectComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myCanvas') myCanvas: ElementRef;
  canvasRC: CanvasRenderingContext2D;

  width;
  height;

  canvas;
  context;
  proton;
  renderer;
  emitter;
  stats;
  index;
  randomBehaviour;
  gravity;

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
    this.context.globalCompositeOperation = 'lighter';
    this.loadImage();
  }

  loadImage() {
    const image = new Image();
    console.log('lading');
    image.onload = (e: any) => {
      console.log('loaded');
      const rect = new Proton.Rectangle(
        (this.canvas.width - e.target.width) / 2, (this.canvas.height - e.target.height) / 2, e.target.width, e.target.height);
      this.context.drawImage(e.target, rect.x, rect.y);
      this.createProton(rect);
      this.tick();
    };
    image.src = './../../assets/CB.png';
  }

  createProton(rect) {
    this.proton = new Proton();
    this.emitter = new Proton.Emitter();
    // setRate
    this.emitter.rate = new Proton.Rate(new Proton.Span(11, 15), new Proton.Span(.04));
    // addInitialize
    this.emitter.addInitialize(new Proton.Position(new Proton.PointZone(0, 0)));
    this.emitter.addInitialize(new Proton.Mass(1));
    this.emitter.addInitialize(new Proton.Radius(8, 13));
    this.emitter.addInitialize(new Proton.Life(2));
    const imagedata = this.context.getImageData(rect.x, rect.y, rect.width, rect.height);
    this.emitter.addInitialize(new Proton.P(new Proton.ImageZone(imagedata, rect.x, rect.y + 0)));
    // addBehaviour

    this.randomBehaviour = new Proton.RandomDrift(2, 2, .2);
    this.gravity = new Proton.Gravity(0);
    this.emitter.addBehaviour(this.customScaleBehaviour());
    this.emitter.addBehaviour(this.gravity);
    this.emitter.addBehaviour(this.randomBehaviour);
    this.emitter.addBehaviour(new Proton.Color(['#00aeff', '#0fa954', '#54396e', '#e61d5f']));
    this.emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, this.canvas.width, this.canvas.height), 'collision'));
    this.emitter.emit();
    // add emitter
    this.proton.addEmitter(this.emitter);

    // canvas renderer
    this.renderer = new Proton.CanvasRenderer(this.canvas);
    this.proton.addRenderer(this.renderer);

    // debug
    // Proton.Debug.drawEmitter(this.proton, this.canvas, this.emitter);

    // let index = 0;
    // window.addEventListener('mousedown', (e) => {
    //   index++;
    //   if (index % 3 === 1) {
    //     this.randomBehaviour.reset(2, 0, .2);
    //     this.gravity.reset(1.5);
    //   } else if (index % 3 === 2) {
    //     this.randomBehaviour.reset(50, 50, .1);
    //     this.gravity.reset(0);
    //   } else {
    //     this.randomBehaviour.reset(2, 2, .2);
    //     this.gravity.reset(0);
    //   }
    // });
  }

  customScaleBehaviour() {
    return {
      initialize: (particle) => {
        particle.oldRadius = particle.radius;
        particle.scale = 0;
      },
      applyBehaviour: (particle) => {
        if (particle.energy >= 2 / 3) {
          particle.scale = (1 - particle.energy) * 3;
        } else if (particle.energy <= 1 / 3) {
          particle.scale = particle.energy * 3;
        }
        particle.radius = particle.oldRadius * particle.scale;
      }
    };
  }

  tick() {
    if (this.play) {
      requestAnimationFrame(this.tick.bind(this));
    }

    this.proton.update();
  }

}
