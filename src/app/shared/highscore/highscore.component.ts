import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { ScoreboardElement } from 'src/app/models/scoreboard';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'deg-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss']
})
export class HighscoreComponent implements OnInit {

  @Input() onlyCompleted = false;
  @Input() onlyOngoing = false; // also only started less that 30 min ago. TODO text somewhere?

  highscores: Observable<ScoreboardElement[]>;
  displayedColumns: string[] = [];
  highscoreName = '';

  constructor(private firestore: AngularFirestore, private masterService: MasterService) { }

  ngOnInit() {

    this.highscores = this.firestore.collection<ScoreboardElement>(
      'scoreboard',
      (reference => this.createQuery(reference))
    ).snapshotChanges().pipe(map(stream => this.mapStream(stream)));

    if (this.onlyCompleted) {
      this.displayedColumns = ['name', 'stage', 'time'];
      this.highscoreName = 'Fullførte';
    } else if (this.onlyOngoing) {
      this.displayedColumns = ['name', 'stage', 'time'];
      this.highscoreName = 'Pågående';
    }

    console.log(this.displayedColumns);
  }

  createQuery(reference: Query) {

    if (this.onlyCompleted) {
      reference = reference
        .where('completed', '==', true)
        .orderBy('startTime', 'desc')
        .limit(10);
    } else if (this.onlyOngoing) {
      reference = reference
        .where('completed', '==', false)
        .where('startTimeUnix', '>', this.masterService.getUnix30MinAgo())
        .orderBy('startTimeUnix', 'desc')
        .limit(10);
    } else {
      reference = reference.orderBy('startTime', 'desc');
    }
    return reference;

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
