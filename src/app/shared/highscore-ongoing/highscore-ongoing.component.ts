import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, timer, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { ScoreboardElement } from 'src/app/models/scoreboard';
import { MasterService } from 'src/app/services/master.service';
import { Stages } from 'src/app/models/stages';

@Component({
  selector: 'deg-highscore-ongoing',
  templateUrl: './highscore-ongoing.component.html',
  styleUrls: ['./highscore-ongoing.component.scss']
})
export class HighscoreOngoingComponent implements OnInit, OnDestroy {

  highscores: Observable<ScoreboardElement[]>;

  nowTime = new Date();
  timerSub: Subscription;

  constructor(private firestore: AngularFirestore, private masterService: MasterService) { }

  ngOnInit() {

    this.highscores = this.firestore.collection<ScoreboardElement>(
      'scoreboard',
      (reference => this.createQuery(reference))
    ).snapshotChanges().pipe(map(stream => this.mapStream(stream)));

    this.timerSub = timer(0, 1000).subscribe({
      next: (tick => {
        this.nowTime = new Date();
      })
    });

  }

  ngOnDestroy() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }

  createQuery(reference: Query) {

    // if (this.onlyCompleted) {
    //   reference = reference
    //     .where('completed', '==', true)
    //     .where('currentStage', '==', Stages.End)
    //     .orderBy('startTime', 'desc')
    //     .limit(10);

    return reference
      .where('completed', '==', false)
      // .where('startTimeUnix', '>', this.masterService.getUnix30MinAgo())
      .orderBy('startTimeUnix', 'desc')
      .limit(20);

  }

  /* Below are A helper function (For getting document ID) */
  private mapStream(stream) {
    return stream.map(document => {
      const data = document.payload.doc.data() as ScoreboardElement;
      const id = document.payload.doc.id;
      return { id, ...data };
    });
  }

}
