import { Component, OnInit } from '@angular/core';
import { ScoreboardElement } from '../models/scoreboard';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, Query } from '@angular/fire/firestore';

@Component({
  selector: 'deg-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss']
})
export class HighscoreComponent implements OnInit {

  highscores: Observable<ScoreboardElement[]>;
  displayedColumns: string[] = ['name', 'stage', 'start', 'end'];

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {

    this.highscores = this.firestore.collection<ScoreboardElement>(
      'scoreboard',
      (reference => this.createQuery(reference))
    ).snapshotChanges().pipe(map(stream => this.mapStream(stream)));
  }

  createQuery(reference: Query) {
    return reference.orderBy('startTime', 'desc');
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
