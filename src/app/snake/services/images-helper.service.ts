import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { toArray, reduce } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
// rename image service
export class ImagesHelperService {

  constructor() { }

  // todo return map as cant garantte order on imgs
  loadImages(paths: string[]): Observable<Map<string, any>> { // HTMLImageElement

    // const images = [];

    return new Observable(subscriber => {
      let loadedImages = 0;

      paths.forEach((currentPath) => {
        const image = new Image();
        image.src = currentPath;
        image.onload = () => {
          loadedImages++;
          subscriber.next([currentPath, image]);
          if (loadedImages === paths.length) {
            subscriber.complete();
          }
        };
      });

    }).pipe(
      reduce((total, current, index) => {
        return total.set(current[0], current[1]);
      }, new Map())
    );


  }

  drawImageWithRotation(context, image, angleInDeg, canvasPosX, canvasPosY, drawWidth, drawHeight ) {
    const x = canvasPosX + (drawWidth / 2);
    const y = canvasPosY + (drawHeight / 2);
    const width = drawWidth;
    const height = drawHeight;
    const angleInRadians = angleInDeg * (Math.PI / 180);

    context.translate(x, y);
    context.rotate(angleInRadians);
    context.drawImage(image, -width / 2, -height / 2, drawWidth, drawHeight);
    context.rotate(-angleInRadians);
    context.translate(-x, -y);
  }

}
