import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessCardComponent } from './access-card/access-card.component';
import { SnakeComponent } from './snake/snake.component';
import { AutoCodeComponent } from './auto-code/auto-code.component';
import { FindQrCodeComponent } from './find-qr-code/find-qr-code.component';
import { HighscoreComponent } from './highscore/highscore.component';
import { LoginComponent } from './login/login.component';
import { GameEndComponent } from './game-end/game-end.component';
import { WelcomeComponent } from './welcome/welcome.component';

// use inbetween components for when between tasks?
// TODO router guard to prevent skipping tasks

// todo routes to const?
const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'accesscard', component: AccessCardComponent },
  { path: 'snake', component: SnakeComponent },
  { path: 'autocode', component: AutoCodeComponent },
  { path: 'findqrcode', component: FindQrCodeComponent },
  { path: 'end', component: GameEndComponent },
  { path: 'highscore', component: HighscoreComponent },
  // { path: 'memory/', component:  }, Memory game?
  // { path: '**', redirectTo: 'login/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
