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

  drawImageWithRotation(context, image, angleInDeg, positionX, positionY, axisX, axisY, drawWidth, drawHeight) {
    const angleInRad = angleInDeg * (Math.PI / 180);
    context.translate(positionX, positionY);
    context.rotate(angleInRad);
    context.drawImage(image, -axisX, -axisY, drawWidth, drawHeight);
    context.rotate(-angleInRad);
    context.translate(-positionX, -positionY);
  }

}
