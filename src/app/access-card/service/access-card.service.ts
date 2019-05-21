import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccessCardService {

  constructor(private http: HttpClient) { }

  detectEmojions(data): Observable<any> {
    const url = 'https://us-central1-digitalescaperoom2019.cloudfunctions.net/vision';
    const postData = { image: data };
    return this.http.post(url, postData)
      .pipe(
        map(response => this.mapVisionToEmojions(response))
      );
  }

  private mapVisionToEmojions(response) {
    if (response && response[0]) {
      return {
        angerLikelihood: response[0].faceAnnotations[0].angerLikelihood,
        blurredLikelihood: response[0].faceAnnotations[0].blurredLikelihood,
        headwearLikelihood: response[0].faceAnnotations[0].headwearLikelihood,
        joyLikelihood: response[0].faceAnnotations[0].joyLikelihood,
        sorrowLikelihood: response[0].faceAnnotations[0].sorrowLikelihood,
        surpriseLikelihood: response[0].faceAnnotations[0].surpriseLikelihood,
        underExposedLikelihood: response[0].faceAnnotations[0].underExposedLikelihood,
      };
    }
    return response;
  }

}
