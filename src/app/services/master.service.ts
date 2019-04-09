import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ScoreboardElement } from '../models/scoreboard';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Stages } from '../models/stages';

// for the complete state
@Injectable({
  providedIn: 'root'
})
export class MasterService {

  public isLoading = new BehaviorSubject<boolean>(true);
  public userId = ''; // userId is document id in scoreboard

  private readonly userIdKey = 'userId';

  constructor(private router: Router, private firestore: AngularFirestore) {

    // temp
    this.setIsLoading(false);
    return;

    const localStorageUserId = localStorage.getItem(this.userIdKey);
    if (localStorageUserId) {
      this.userId = localStorageUserId;
      this.loadUser();
    } else {
      this.router.navigate(['login']);
      this.setIsLoading(false);
    }
  }

  public loadUser() {
    this.firestore.collection<ScoreboardElement>(
      'scoreboard'
    ).doc(this.userId).get().subscribe(doc => {
      // TODO what if not found
      const lastStageCompleted = doc.data().stageCompleted;
      this.gotoCorrectStage(lastStageCompleted + 1 as Stages);
      this.setIsLoading(false);
    });
  }

  public gotoCorrectStage(stage: Stages) {
    if (stage === Stages.Login) {
      this.router.navigate(['login']);
    } else if (stage === Stages.AccessCard) {
      this.router.navigate(['accesscard']);
    } else { // TODO REST!
      this.router.navigate(['login']);
    }
  }

  public createUser(username: string) {
    this.setIsLoading(true);
    const docId = this.getRandDocId();
    this.firestore.collection<ScoreboardElement>(
      'scoreboard'
    ).doc(docId).set({
      endTime: -1,
      startTime: + new Date(),
      name: username,
      score: 0,
      stageCompleted: Stages.Login
    }).then(() => {
      this.setIsLoading(false);
      this.router.navigate(['accesscard']);
    });

    localStorage.setItem(this.userIdKey, docId);
    this.userId = docId;
  }

  public updateStageInBackend(newStage: Stages) {

  }

  public setIsLoading(newValue) {
    this.isLoading.next(newValue);
  }

  private getRandDocId(): string {
    return this.firestore.createId();
  }

}
