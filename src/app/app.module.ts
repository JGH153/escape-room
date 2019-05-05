import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
   MatToolbarModule,
   MatSidenavModule,
   MatButtonModule,
   MatIconModule,
   MatCardModule,
   MatSlideToggleModule,
   MatSliderModule,
   MatDividerModule,
   MatDialogModule,
   MatInputModule,
   MatCheckboxModule,
   MatProgressSpinnerModule,
   MatTableModule,
   MatSnackBarModule,
} from '@angular/material';
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
import { HighscoreComponent } from './highscore/highscore.component';
import { LoginComponent } from './login/login.component';
import { GameEndComponent } from './game-end/game-end.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { InfoOverlayComponent } from './shared/info-overlay/info-overlay.component';
import { MemoryComponent } from './memory/memory.component';

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
];

@NgModule({
   declarations: [
      AppComponent,
      AccessCardComponent,
      SnakeComponent,
      AutoCodeComponent,
      FindQrCodeComponent,
      HighscoreComponent,
      LoginComponent,
      GameEndComponent,
      WelcomeComponent,
      InfoOverlayComponent,
      MemoryComponent
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
      FormsModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
