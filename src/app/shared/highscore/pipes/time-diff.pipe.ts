import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDiff'
})
export class TimeDiffPipe implements PipeTransform {

  transform(timeA: any, timeB?: any): any {
    timeA = new Date(timeA);
    timeB = new Date(timeB);
    let diffInSec: number = (timeA.getTime() - timeB.getTime()) / 1000;
    if (isNaN(diffInSec)) { // bit dirty for when end time is not set yet
      timeA = new Date();
      diffInSec = (timeA.getTime() - timeB.getTime()) / 1000;
    }
    const diffMinutes = Math.floor(diffInSec / 60);
    const remainingDiffSec = Math.floor(diffInSec - (diffMinutes * 60));
    return diffMinutes + 'min' + ' ' + remainingDiffSec + 'sek';
  }

}
