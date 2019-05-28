import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {

  constructor() { }

  fullscreenEnabled() {
    return document.fullscreenEnabled
      || (document as any).mozFullScreenEnabled
      || (document as any).documentElement.webkitRequestFullScreen;
  }

  requestFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }

  exitFullscreen(element) {
    if (element.cancelFullScreen) {
      element.cancelFullScreen();
    } else if (element.mozCancelFullScreen) {
      element.mozCancelFullScreen();
    } else if (element.webkitCancelFullScreen) {
      element.webkitCancelFullScreen();
    }
  }

}
