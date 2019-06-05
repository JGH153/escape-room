import { Subject } from 'rxjs';
import { SwipeDirection } from 'src/app/models/swipe';

interface Vec2 {
  x;
  y;
}

export class SwipeHandler {

  swipeEvents = new Subject<SwipeDirection>();

  startPos: Vec2 | null;

  minDistance = 100; // in px

  constructor() {
  }

  init() {
    document.addEventListener('touchstart', this.handleStart.bind(this), false);
    document.addEventListener('touchend', this.handleEnd.bind(this), false);
  }

  deconstruct() {
    this.swipeEvents.complete();
    document.removeEventListener('touchstart', this.handleStart.bind(this), false);
    document.removeEventListener('touchend', this.handleEnd.bind(this), false);
  }

  handleStart(event: TouchEvent) {
    this.startPos = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY
    };
  }

  handleEnd(event: TouchEvent) {
    if (!this.startPos) {
      console.warn('WTF');
      return;
    }
    const absX = this.getAbsDistance(event.changedTouches[0].clientX, this.startPos.x);
    const absY = this.getAbsDistance(event.changedTouches[0].clientY, this.startPos.y);
    const endPos = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY
    };
    const swipe = this.getSwipeDirection(this.startPos, endPos, absX, absY);
    if (swipe !== SwipeDirection.None) {
      this.swipeEvents.next(swipe);
    }

  }

  getAbsDistance(a: number, b: number): number {
    return Math.abs(a - b);
  }

  getSwipeDirection(startPos: Vec2, endPos: Vec2, absX: number, absY: number) {
    if (absX > absY && absX > this.minDistance) {
      if (startPos.x > endPos.x) {
        return SwipeDirection.Left;
      } else {
        return SwipeDirection.Right;
      }
    } else if (absY > this.minDistance) {
      if (startPos.y > endPos.y) {
        return SwipeDirection.Up;
      } else {
        return SwipeDirection.Down;
      }
    }
    return SwipeDirection.None;
  }

}
