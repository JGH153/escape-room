import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmojiLikelihood } from './emoji-likelihood';

@Injectable({
  providedIn: 'root'
})
export class AccessCardService {

  constructor(private http: HttpClient) { }

  detectEmojions(data): Observable<any> {
    const url = 'https://europe-west1-digitalescaperoom2019.cloudfunctions.net/vision';
    const postData = { image: data };
    return this.http.post(url, postData)
      .pipe(
        map(response => this.mapVisionToEmojions(response))
      );
  }

  getActiveEmojions(response): string {
    let returnEmojiis = '';
    if (this.emojiPossibleOrMore(response.joyLikelihood)) {
      returnEmojiis += '😄';
    }
    if (this.emojiPossibleOrMore(response.angerLikelihood)) {
      returnEmojiis += '😠';
    }
    if (this.emojiPossibleOrMore(response.sorrowLikelihood)) {
      returnEmojiis += '😢';
    }
    if (this.emojiPossibleOrMore(response.surpriseLikelihood)) {
      returnEmojiis += '😱';
    }
    return returnEmojiis;
  }

  emojiPossibleOrMore(emoji: EmojiLikelihood) {
    if (emoji === EmojiLikelihood.LIKELY
      || emoji === EmojiLikelihood.VERY_LIKELY
      || emoji === EmojiLikelihood.POSSIBLE) {
      return true;
    }
    return false;
  }

  private mapVisionToEmojions(response) {
    if (response && response[0] && response[0].faceAnnotations[0]) {
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
    return this.getDefaultResponse();
  }

  private getDefaultResponse() {
    return {
      angerLikelihood: EmojiLikelihood.UNKNOWN,
      blurredLikelihood: EmojiLikelihood.UNKNOWN,
      headwearLikelihood: EmojiLikelihood.UNKNOWN,
      joyLikelihood: EmojiLikelihood.UNKNOWN,
      sorrowLikelihood: EmojiLikelihood.UNKNOWN,
      surpriseLikelihood: EmojiLikelihood.UNKNOWN,
      underExposedLikelihood: EmojiLikelihood.UNKNOWN,
    };
  }

}
