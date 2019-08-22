import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { ScoreboardElement } from '../models/scoreboard';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Stages } from '../models/stages';

import {
  subMinutes
} from 'date-fns';
import { map } from 'rxjs/operators';

// for the complete state
@Injectable({
  providedIn: 'root'
})
export class MasterService {

  public isLoading = new BehaviorSubject<boolean>(true);
  public userId = ''; // userId is document id in scoreboard
  public username = new BehaviorSubject<string>('');
  public startTime; // = subMinutes(new Date(), 2);

  public ownImageDataUrl;

  private readonly userIdKey = 'userId';
  private readonly firstUserIdKey = 'FirstUserId';

  constructor(private router: Router, private firestore: AngularFirestore) {

    const localStorageUserId = localStorage.getItem(this.userIdKey);
    if (localStorageUserId) {
      this.userId = localStorageUserId;
      this.loadUser();
    } else {
      // this.router.navigate(['login']); TODO re-add
      this.setIsLoading(false);
    }

  }

  public setOwnImage(imageDataUrl: string) {
    this.ownImageDataUrl = imageDataUrl;
  }

  public getRandomWinner() {
    // add some delay for effect?
    this.setIsLoading(true);
    return this.firestore.collection<ScoreboardElement>(
      'scoreboard',
      (reference => reference.where('completed', '==', true))
    ).get().pipe(
      map(result => {
        this.setIsLoading(false);
        const randPos = this.getRandNumber(result.size);
        return result.docs[randPos].get('name');
      })
    );
  }

  getRandNumber(toRange) {
    return Math.floor(Math.random() * toRange);
  }

  public loadUser() {
    this.firestore.collection<ScoreboardElement>(
      'scoreboard'
    ).doc(this.userId).get().subscribe(doc => {
      // TODO what if not found
      // this.gotoCorrectStage(doc.data().stageCompleted + 1 as Stages);

      if (doc.exists) {
        this.username.next(doc.data().name);
      } else {
        localStorage.removeItem(this.userIdKey);
      }

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
    ).doc<ScoreboardElement>(docId).set({
      id: docId,
      endTime: '',
      endTimeUnix: 0,
      startTime: new Date().toISOString(),
      startTimeUnix: this.getUnixTime(new Date()),
      completed: false,
      name: username,
      score: 0,
      currentStage: Stages.AccessCard,
      noCamera: !navigator.mediaDevices,
    }).then(() => {
      this.setIsLoading(false);
      this.username.next(username);
      this.router.navigate(['accesscard']);
    });

    localStorage.setItem(this.userIdKey, docId);
    if (!localStorage.getItem(this.firstUserIdKey)) {
      localStorage.setItem(this.firstUserIdKey, docId);
    }
    this.userId = docId;
  }

  // should be in backend
  public getDuration(endTime: Date) {
    return this.firestore.collection<ScoreboardElement>(
      'scoreboard'
    ).doc(this.userId).get().pipe(map(current => {
      const diffInSec: number = (endTime.getTime() - new Date(current.data().startTime).getTime()) / 1000;
      return diffInSec;
    }));
  }

  public completeGame() {
    const endTime = new Date();
    this.getDuration(endTime).subscribe({
      next: (duration) => {

        let hideInScoreboard = false;
        // if user have submitted before
        if (localStorage.getItem(this.firstUserIdKey) !== localStorage.getItem(this.userIdKey)) {
          hideInScoreboard = true;
        }

        const dataToSave = {
          currentStage: Stages.End,
          endTime: endTime.toISOString(),
          endTimeUnix: this.getUnixTime(endTime),
          durationTimeSec: duration,
          completed: true,
          hideInScoreboard
        };

        this.setIsLoading(true);
        const docId = this.userId;
        this.firestore.collection<ScoreboardElement>(
          'scoreboard'
        ).doc(docId).set(dataToSave, { merge: true }).then(() => {
          this.firestore.collection<ScoreboardElement>(
            'scoreboard'
          ).doc(this.userId).get().subscribe(doc => {
            this.startTime = doc.data().startTime;
            this.setIsLoading(false);
            this.gotoCorrectStage(Stages.End);

            if (hideInScoreboard) {
              this.updateFirstUserSubmission();
            }
          });
        });

      }
    });
  }

  // updates first if current is faster
  updateFirstUserSubmission() {
    const firstUserId = localStorage.getItem(this.firstUserIdKey);
    const currentUserId = localStorage.getItem(this.userIdKey);

    combineLatest(
      this.firestore.collection<ScoreboardElement>('scoreboard').doc(firstUserId).get()
        .pipe(map(current => current.data() as ScoreboardElement)),
      this.firestore.collection<ScoreboardElement>('scoreboard').doc(currentUserId).get()
        .pipe(map(current => current.data() as ScoreboardElement)),
    ).subscribe({
      next: bothDocs => {
        const firstSubDoc: ScoreboardElement = bothDocs[0];
        const currentSubDoc: ScoreboardElement = bothDocs[1];

        // update first if current is faster time
        if (currentSubDoc.durationTimeSec < firstSubDoc.durationTimeSec || !firstSubDoc.durationTimeSec) {
          firstSubDoc.durationTimeSec = currentSubDoc.durationTimeSec;
          firstSubDoc.endTime = currentSubDoc.endTime;
          firstSubDoc.endTimeUnix = currentSubDoc.endTimeUnix;
          firstSubDoc.startTime = currentSubDoc.startTime;
          firstSubDoc.startTimeUnix = currentSubDoc.startTimeUnix;
          firstSubDoc.score = currentSubDoc.score;
          firstSubDoc.currentStage = currentSubDoc.currentStage;
          firstSubDoc.completed = currentSubDoc.completed;
          firstSubDoc.hideInScoreboard = false;
          this.firestore.collection<ScoreboardElement>('scoreboard').doc(firstUserId).set(firstSubDoc, { merge: true });
        }
        // no one can delete for now, need guest users for that
        // this.firestore.collection<ScoreboardElement>('scoreboard').doc(currentUserId).delete();
      }
    });
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

    const dataToSave: Partial<ScoreboardElement> = {
      currentStage: newStage,
    };

    this.setIsLoading(true);
    const docId = this.userId;
    this.firestore.collection<ScoreboardElement>(
      'scoreboard'
    ).doc(docId).set(dataToSave, { merge: true }).then(() => {
      this.firestore.collection<ScoreboardElement>(
        'scoreboard'
      ).doc(this.userId).get().subscribe(doc => {
        this.startTime = doc.data().startTime;
        this.setIsLoading(false);
        this.gotoCorrectStage(newStage);
      });
    });

  }

  public getStartTime() {
    return this.startTime;
  }


  public setDeviceCameraId(id: string) {
    if (!this.userId) {
      this.gotoCorrectStage(Stages.Login);
      return;
    }
    const docId = this.userId;
    this.firestore.collection<ScoreboardElement>(
      'scoreboard'
    ).doc(docId).set({ cameraDeviceId: id }, { merge: true }).then(() => {
      console.log('saved');
    });
  }

  public setIsLoading(newValue) {
    this.isLoading.next(newValue);
  }

  public getUnixMinAgo(min) {
    return this.getUnixTime(subMinutes(new Date(), min));
  }

  public getColors() {
    return ['#FED546', '#FF5F63', '#49BCA1', '#29CFF5'];
  }

  public getRandomColor() {
    return this.getColors()[Math.floor(Math.random() * this.getColors().length)];
  }

  private getRandDocId(): string {
    return this.firestore.createId();
  }

  private getUnixTime(date: Date) {
    return Math.floor(date.getTime() / 1000);
  }

}
