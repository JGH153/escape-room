import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ScoreboardElement } from '../models/scoreboard';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Stages } from '../models/stages';

import {
  subMinutes
} from 'date-fns';

// for the complete state
@Injectable({
  providedIn: 'root'
})
export class MasterService {

  public isLoading = new BehaviorSubject<boolean>(true);
  public userId = ''; // userId is document id in scoreboard
  public username = new BehaviorSubject<string>('');

  private readonly userIdKey = 'userId';

  constructor(private router: Router, private firestore: AngularFirestore) {

    const localStorageUserId = localStorage.getItem(this.userIdKey);
    if (localStorageUserId) {
      this.userId = localStorageUserId;
      this.loadUser();
    } else {
      // this.router.navigate(['login']);
      this.setIsLoading(false);
    }

    console.log(this.getUnixTime(new Date()));
  }

  public loadUser() {
    this.firestore.collection<ScoreboardElement>(
      'scoreboard'
    ).doc(this.userId).get().subscribe(doc => {
      // TODO what if not found
      // this.gotoCorrectStage(doc.data().stageCompleted + 1 as Stages);
      this.username.next(doc.data().name);
      this.setIsLoading(false);
    });
  }

  public gotoCorrectStage(stage: Stages) {
    if (stage === Stages.Login) {
      this.router.navigate(['login']);
    } else if (stage === Stages.AccessCard) {
      this.router.navigate(['accesscard']);
    } else if (stage === Stages.Snake) {
      this.router.navigate(['snake']);
    } else if (stage === Stages.Autocode) {
      this.router.navigate(['autocode']);
    } else if (stage === Stages.FindQrCode) {
      this.router.navigate(['findqrcode']);
    } else if (stage === Stages.Memory) {
      this.router.navigate(['memory']);
    } else if (stage === Stages.End) {
      this.router.navigate(['end']);
    } else {
      this.router.navigate(['login']);
    }
  }

  public createUser(username: string) {
    this.setIsLoading(true);
    const docId = this.getRandDocId();
    this.firestore.collection<ScoreboardElement>(
      'scoreboard'
    ).doc(docId).set({
      endTime: '',
      endTimeUnix: '',
      startTime: new Date().toISOString(),
      startTimeUnix: this.getUnixTime(new Date()),
      completed: false,
      name: username,
      score: 0,
      stageCompleted: Stages.Login
    }).then(() => {
      this.setIsLoading(false);
      this.username.next(username);
      this.router.navigate(['accesscard']);
    });

    localStorage.setItem(this.userIdKey, docId);
    this.userId = docId;
  }

  // TODO prevent spamming
  public gotoStage(newStage: Stages) {
    if (this.isLoading.value) {
      return;
    }

    if (!this.userId) {
      this.gotoCorrectStage(Stages.Login);
      return;
    }

    let dataToSave: Partial<ScoreboardElement> = {
      stageCompleted: newStage
    };
    if (newStage === Stages.End) {
      const durationTimeSec = 1337; // TODO
      dataToSave = {
        stageCompleted: newStage,
        endTime: new Date().toISOString(),
        endTimeUnix: this.getUnixTime(new Date()),
        durationTimeSec,
        completed: true,
      };
    }

    this.setIsLoading(true);
    const docId = this.userId;
    this.firestore.collection<ScoreboardElement>(
      'scoreboard'
    ).doc(docId).set(dataToSave, { merge: true }).then(() => {
      this.setIsLoading(false);
      this.gotoCorrectStage(newStage);
    });
  }

  public setDeviceCameraId(id: string) {
    if (!this.userId) {
      this.gotoCorrectStage(Stages.Login);
      return;
    }
    const docId = this.userId;
    this.firestore.collection<ScoreboardElement>(
      'scoreboard'
    ).doc(docId).set({cameraDeviceId: id}, { merge: true }).then(() => {
      console.log('saved');
    });
  }

  public setIsLoading(newValue) {
    this.isLoading.next(newValue);
  }

  public getUnix30MinAgo() {
    return this.getUnixTime(subMinutes(new Date(), 30));
  }

  private getRandDocId(): string {
    return this.firestore.createId();
  }

  private getUnixTime(date: Date) {
    return Math.floor(date.getTime() / 1000);
  }

}
