import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { AccessCardComponent } from './access-card/access-card.component';
import { SnakeComponent } from './snake/snake.component';
import { AutoCodeComponent } from './auto-code/auto-code.component';
import { FindQrCodeComponent } from './find-qr-code/find-qr-code.component';

import { LoginComponent } from './login/login.component';
import { GameEndComponent } from './game-end/game-end.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { InfoOverlayComponent } from './shared/info-overlay/info-overlay.component';
import { MemoryComponent } from './memory/memory.component';
import { HighscorePageComponent } from './highscore-page/highscore-page.component';
import { VictoryComponent } from './shared/victory/victory.component';
import { FireworkEffectComponent } from './shared/victory/firework-effect/firework-effect.component';
import { LinesEffectComponent } from './shared/victory/lines-effect/lines-effect.component';
import { LogoEffectComponent } from './shared/victory/logo-effect/logo-effect.component';
import { DnaEffectComponent } from './shared/victory/dna-effect/dna-effect.component';
import { HttpClientModule } from '@angular/common/http';
import { GameIntroComponent } from './shared/game-intro/game-intro.component';
import { AdminComponent } from './admin/admin.component';
import { WinPopupComponent } from './game-end/win-popup/win-popup.component';
import { ConfettiEffectComponent } from './shared/confetti-effect/confetti-effect.component';
import { HighscoreTopComponent } from './shared/highscore-top/highscore-top.component';
import { HighscoreOngoingComponent } from './shared/highscore-ongoing/highscore-ongoing.component';
import { StageNamePipe } from './shared/highscore-ongoing/pipes/stage-name.pipe';
import { HighscoreLineComponent } from './shared/highscore-ongoing/highscore-line/highscore-line.component';
import { TimeDiffSecPipe } from './shared/highscore-ongoing/pipes/time-diff-sec.pipe';
import { TimeDiffMinPipe } from './shared/highscore-ongoing/pipes/time-diff-min.pipe';
import { HighscoreTimeComponent } from './shared/highscore-time/highscore-time.component';

const matImports = [
   MatCardModule,
   MatButtonModule,
   MatToolbarModule,
   MatSidenavModule,
   MatIconModule,
   MatSlideToggleModule,
   MatSliderModule,
   MatDividerModule,
   MatDialogModule,
   MatInputModule,
   MatCheckboxModule,
   MatProgressSpinnerModule,
   MatCardModule,
   MatTableModule,
   MatSnackBarModule,
   MatProgressBarModule,
];

@NgModule({
   declarations: [
      AppComponent,
      AccessCardComponent,
      SnakeComponent,
      AutoCodeComponent,
      FindQrCodeComponent,
      HighscoreOngoingComponent,
      HighscorePageComponent,
      LoginComponent,
      GameEndComponent,
      WelcomeComponent,
      InfoOverlayComponent,
      MemoryComponent,
      VictoryComponent,
      FireworkEffectComponent,
      LinesEffectComponent,
      LogoEffectComponent,
      DnaEffectComponent,
      TimeDiffSecPipe,
      TimeDiffMinPipe,
      GameIntroComponent,
      AdminComponent,
      WinPopupComponent,
      ConfettiEffectComponent,
      StageNamePipe,
      HighscoreLineComponent,
      HighscoreTopComponent,
      HighscoreTimeComponent
   ],
   entryComponents: [],
   imports: [
      BrowserModule,
      AppRoutingModule,
      matImports,
      BrowserAnimationsModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireFunctionsModule,
      AngularFireAuthModule,
      FormsModule,
      HttpClientModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
