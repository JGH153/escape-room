import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy, HostListener, ChangeDetectorRef, ViewRef, ɵConsole } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { MasterService } from '../services/master.service';
import { Router } from '@angular/router';
import { Stages } from '../models/stages';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FullscreenService } from '../services/fullscreen.service';
import { ImagesLoaderService } from './services/images-loader.service';

enum MoveDirection {
  Up,
  Right,
  Down,
  Left
}

interface GridPos {
  x: number;
  y: number;
}

// game board is 10 x 20 sqares?

@Component({
  selector: 'deg-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild('myCanvas', { static: true }) myCanvas;
  canvasRC: CanvasRenderingContext2D;

  image: HTMLImageElement;

  moveDirection = MoveDirection.Down;

  width;
  height;

  blockWidth;
  blockHeight;

  numBlocsWidth = 10;
  numBlocsHeight = 20;

  showIntro = false;
  hasChangedMoveDir = false;
  showOutro = false;
  showWin = false;
  stopDrawing = false;

  // on grid from numBlocs
  snakeHeadPos: GridPos = { x: this.numBlocsWidth / 2, y: this.numBlocsHeight / 2 };
  snakeLength = 1;
  snakeFrame = 0;
  targetSnakeLength = 4;
  snakeBody: Array<GridPos> = [
    // { ...this.snakeHeadPos, x: this.snakeHeadPos.x - 1 },
    // { ...this.snakeHeadPos, x: this.snakeHeadPos.x - 2 },
    // { ...this.snakeHeadPos, x: this.snakeHeadPos.x - 3 },
    // { ...this.snakeHeadPos, x: this.snakeHeadPos.x - 4 },
    // { ...this.snakeHeadPos, x: this.snakeHeadPos.x - 5 },
    // { ...this.snakeHeadPos, x: this.snakeHeadPos.x - 6 },
  ];
  snakeFoodPos: GridPos = { x: 5, y: 1 };

  myTimer = timer(0, 250);
  timerSub: Subscription;

  hasNotifiedUserOnOrtientation = false;

  images = [];
  foodImg;
  snakeImgs;

  deg = 90;

  constructor(
    private router: Router,
    private masterService: MasterService,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private fullscreenService: FullscreenService,
    private imagesLoaderService: ImagesLoaderService
  ) { }

  ngOnInit() {

  }

  ngAfterContentInit() {
    this.canvasRC = this.myCanvas.nativeElement.getContext('2d');
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', this.onKeyPress.bind(this));
    // TODO fix https://github.com/aframevr/aframe/issues/3976
    window.addEventListener('deviceorientation', this.handleOrientation.bind(this), true);

    window.addEventListener('orientationchange', this.onOrientationchange.bind(this), true);

    this.initSnake(); // temp
  }

  ngOnDestroy() {
    document.body.style.overflow = 'visible';
    document.removeEventListener('keydown', this.onKeyPress.bind(this));
    document.removeEventListener('orientationchange', this.onOrientationchange.bind(this), true);
    window.removeEventListener('deviceorientation', this.handleOrientation.bind(this), true);
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
    this.fullscreenService.exitFullscreen(document);
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.unlock();
    }

  }

  // only works on mobile
  onOrientationchange() {
    if (!this.hasNotifiedUserOnOrtientation) {
      this.openStopRotateSnackBar();
    }
    this.hasNotifiedUserOnOrtientation = true;
  }

  loadImages() {

    const imageSrc = [
      'assets/snake/logo1.png',
      'assets/snake/logo2.png',
      'assets/snake/logo3.png',
      'assets/snake/sky.png',
    ];

    this.imagesLoaderService.loadImages(imageSrc).subscribe(images => {
      console.log(images, 'images!');
      this.images = images;
      this.snakeImgs = [images[0], images[1], images[2]];
      this.foodImg = images[3];
      this.imagesLoaded();
    });
  }

  imagesLoaded() {
    this.timerSub = this.myTimer.subscribe({ next: this.logicTick.bind(this) });

    setTimeout(() => {
      if (!this.hasChangedMoveDir && !(this.changeDetector as ViewRef).destroyed) {
        this.openHelpSnackBar();
      }
    }, 5000);

    this.draw();
  }

  initSnake() {

    this.loadImages();

    // this.fullscreenService.requestFullscreen(document.body);
    // if (window.screen && window.screen.orientation) {
    //   window.screen.orientation.lock('portrait');
    // }
  }

  closeIntro() {
    this.showIntro = false;
    this.initSnake();
  }

  gotoNextTask() {
    this.masterService.gotoStage(Stages.Autocode);
  }

  setShowOutro() {
    this.showWin = false;
    this.showOutro = true;
  }

  openHelpSnackBar() {
    const durationInSeconds = 6;
    this.snackBar.open(
      'Prøv å roter telefonen!',
      '',
      {
        duration: durationInSeconds * 1000,
      }
    );
  }

  openStopRotateSnackBar() {
    const durationInSeconds = 6;
    this.snackBar.open(
      'Du bør låse roteringen på telefonen 🤔',
      '',
      {
        duration: durationInSeconds * 1000,
      }
    );
  }

  handleOrientation(event) {
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta; // forward and back ( positive down, neg up)
    const gamma = event.gamma; // left n right (positive right, neg left)

    if (Math.abs(beta) > Math.abs(gamma)) {
      if (beta > 0) { // positive down, neg up
        this.moveDirection = MoveDirection.Down;
      } else {
        this.moveDirection = MoveDirection.Up;
        this.hasChangedMoveDir = true;
      }
    } else {
      this.hasChangedMoveDir = true;
      if (gamma > 0) { // positive right, neg left
        this.moveDirection = MoveDirection.Right;
      } else {
        this.moveDirection = MoveDirection.Left;
      }
    }

  }

  onKeyPress(event: KeyboardEvent) {

    if (event.code === 'ArrowUp') {
      this.moveDirection = MoveDirection.Up;
    } else if (event.code === 'ArrowRight') {
      this.moveDirection = MoveDirection.Right;
    } else if (event.code === 'ArrowDown') {
      this.moveDirection = MoveDirection.Down;
    } else if (event.code === 'ArrowLeft') {
      this.moveDirection = MoveDirection.Left;
    }

    this.hasChangedMoveDir = true;

  }

  logicTick() {
    this.updateSnakePos();
    this.handleEating();
    this.handleIfWon();

    this.snakeFrame++;
    if (this.snakeFrame > 2) {
      this.snakeFrame = 0;
    }
  }

  handleIfWon() {
    if (this.snakeBody.length >= this.targetSnakeLength) {
      // WON!
      this.showWin = true;
      this.stopDrawing = true;
    }
  }


  handleEating() {
    if (this.snakeHeadPos.x === this.snakeFoodPos.x && this.snakeHeadPos.y === this.snakeFoodPos.y) {
      this.makeSnakeLonger();
      this.newFood();
    }
  }

  makeSnakeLonger() {
    if (this.snakeBody.length === 0) {
      this.snakeBody.push({ ...this.snakeHeadPos });
    } else {
      this.snakeBody.push({ ...this.snakeBody[this.snakeBody.length - 1] });
    }
  }

  // TODO not inside snake
  newFood() {
    this.snakeFoodPos = {
      x: this.getRandNumber(this.numBlocsWidth),
      y: this.getRandNumber(this.numBlocsHeight),
    };
    // TODO if inside snake redo
  }

  updateSnakePos() {
    this.updateSnakeBody();

    if (this.moveDirection === MoveDirection.Up) {
      this.snakeHeadPos.y--;
    } else if (this.moveDirection === MoveDirection.Right) {
      this.snakeHeadPos.x++;
    } else if (this.moveDirection === MoveDirection.Down) {
      this.snakeHeadPos.y++;
    } else if (this.moveDirection === MoveDirection.Left) {
      this.snakeHeadPos.x--;
    }

    this.checkIfDefeated();
    if (this.snakeHeadPos.x >= this.numBlocsWidth) {
      this.snakeHeadPos.x = 0;
    }
    if (this.snakeHeadPos.y >= this.numBlocsHeight) {
      this.snakeHeadPos.y = 0;
    }
  }

  updateSnakeBody() {
    for (let i = this.snakeBody.length - 1; i >= 0; i--) {
      if (i === 0) {
        this.snakeBody[i] = { ...this.snakeHeadPos };
      } else {
        this.snakeBody[i] = { ...this.snakeBody[i - 1] };
      }
    }
  }

  checkIfDefeated() {
    if (this.snakeHeadPos.x >= this.numBlocsWidth
      || this.snakeHeadPos.y >= this.numBlocsHeight
      || this.snakeHeadPos.x < 0
      || this.snakeHeadPos.y < 0) {
      this.resetGame();
    }
    if (this.snakeHeadInsideBody()) {
      this.resetGame();
    }
  }

  snakeHeadInsideBody(): boolean {
    let isInside = false;
    this.snakeBody.forEach(current => {
      if (this.twoGridPosOverlap(this.snakeHeadPos, current)) {
        isInside = true;
      }
    });
    return isInside;
  }

  twoGridPosOverlap(a: GridPos, b: GridPos) {
    return a.x === b.x && a.y === b.y;
  }

  resetGame() {
    this.snakeHeadPos.x = this.numBlocsWidth / 2;
    this.snakeHeadPos.y = this.numBlocsHeight / 2;
    this.snakeBody = [];
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(150);
    }
  }

  // drawing below. Move to own class?

  draw() {

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.blockWidth = this.width / this.numBlocsWidth;
    this.blockHeight = this.height / this.numBlocsHeight;
    // console.log('drawing', this.width);

    this.myCanvas.nativeElement.width = this.width;
    this.myCanvas.nativeElement.height = this.height;

    this.drawReset();
    this.drawAllSquares();
    this.drawFood();
    this.drawSnake();



    if (this.stopDrawing) {
      return;
    }

    requestAnimationFrame(this.draw.bind(this));
  }

  drawFood() {
    this.deg++;
    const xPosHead = this.blockWidth * this.snakeFoodPos.x;
    const yPosHead = this.blockHeight * this.snakeFoodPos.y;
    // this.drawRect(xPosHead, yPosHead, this.blockWidth, this.blockHeight, 'white');
    this.canvasRC.drawImage(this.foodImg, xPosHead, yPosHead, this.blockWidth, this.blockHeight);

    const angleInDeg = this.deg;
    const x = xPosHead + (this.blockWidth / 2);
    const y = yPosHead + (this.blockHeight / 2);
    const width = this.blockWidth;
    const height = this.blockHeight;
    const angleInRadians = angleInDeg * (Math.PI / 180);

    this.canvasRC.translate(x, y);
    this.canvasRC.rotate(angleInRadians);
    this.canvasRC.drawImage(this.foodImg,  -width / 2, -height / 2, this.blockWidth, this.blockHeight);
    this.canvasRC.rotate(-angleInRadians);
    this.canvasRC.translate(-x, -y);


    // this.imagesLoaderService.drawImageWithRotation(
    //   this.canvasRC,
    //   this.foodImg,
    //   this.deg,
    //   xPosHead,
    //   yPosHead,
    //   0,
    //   0,
    //   this.blockWidth,
    //   this.blockHeight
    // );
  }

  drawReset() {
    this.drawRect(0, 0, this.width, this.height, 'black');
  }

  drawSnake() {
    const xPosHead = this.blockWidth * this.snakeHeadPos.x;
    const yPosHead = this.blockHeight * this.snakeHeadPos.y;
    // this.drawRect(xPosHead, yPosHead, this.blockWidth, this.blockHeight, 'red');
    this.canvasRC.drawImage(this.snakeImgs[this.snakeFrame], xPosHead, yPosHead, this.blockWidth, this.blockHeight);

    // body
    this.snakeBody.forEach(current => {
      const xPos = this.blockWidth * current.x;
      const yPos = this.blockHeight * current.y;
      this.drawRect(xPos, yPos, this.blockWidth, this.blockHeight, 'blue');
    });
  }

  drawAllSquares() {

    for (let x = 0; x < this.numBlocsWidth; x++) {
      for (let y = 0; y < this.numBlocsHeight; y++) {
        const xPos = this.blockWidth * x;
        const yPos = this.blockHeight * y;
        const color = 'black';
        this.drawRect(xPos, yPos, this.blockWidth, this.blockHeight, color);
      }
    }
  }

  drawRect(x, y, w, h, color: string) {
    this.canvasRC.fillStyle = color;
    this.canvasRC.fillRect(x, y, w, h);
  }

  getRandomColor(): string {
    return 'rgb('
      + this.getRandNumber(255) + ', '
      + this.getRandNumber(255) + ', '
      + this.getRandNumber(255) + ')';
  }

  getRandNumber(toRange) {
    return Math.floor(Math.random() * toRange);
  }

}
