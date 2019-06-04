import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
// rename image service
export class ImagesLoaderService {

  constructor() { }

  // todo return map as cant garantte order on imgs
  loadImages(paths: string[]): Observable<any> { // HTMLImageElement

    // const images = [];

    return new Observable(subscriber => {
      let loadedImages = 0;

      paths.forEach((current) => {
        const image = new Image();
        image.src = current;
        image.onload = () => {
          loadedImages++;
          subscriber.next(image);
          if (loadedImages === paths.length) {
            subscriber.complete();
          }
        };
      });

    }).pipe(
      toArray()
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
