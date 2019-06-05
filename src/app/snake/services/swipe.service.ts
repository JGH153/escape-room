import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SwipeDirection } from 'src/app/models/swipe';
import { SwipeHandler } from './swipe-handler';

@Injectable({
  providedIn: 'root'
})
export class SwipeService {

  constructor() { }

  getSwipes(): Observable<SwipeDirection> {
    return new Observable(subscriber => {

      const swipeHandler = new SwipeHandler();
      swipeHandler.init();
      const sub = swipeHandler.swipeEvents.subscribe({
        next: (swipe) => {
          subscriber.next(swipe);
        }
      });

      return function unsubscribe() {
        swipeHandler.deconstruct();
        sub.unsubscribe();
      };
    });
  }


}
