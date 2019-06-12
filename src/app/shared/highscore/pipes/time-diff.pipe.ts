import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDiff'
})
export class TimeDiffPipe implements PipeTransform {

  transform(startTime: any, endTime?: any): any {
    endTime = new Date(endTime);
    startTime = new Date(startTime);
    let diffInSec: number = (endTime.getTime() - startTime.getTime()) / 1000;
    if (isNaN(diffInSec)) { // bit dirty for when end time is not set yet
      endTime = new Date();
      diffInSec = (endTime.getTime() - startTime.getTime()) / 1000;
    }
    const diffMinutes = Math.floor(diffInSec / 60);
    const remainingDiffSec = Math.floor(diffInSec - (diffMinutes * 60));
    return diffMinutes + 'min' + ' ' + remainingDiffSec + 'sek';
  }

}
