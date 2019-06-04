import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessCardComponent } from './access-card/access-card.component';
import { SnakeComponent } from './snake/snake.component';
import { AutoCodeComponent } from './auto-code/auto-code.component';
import { FindQrCodeComponent } from './find-qr-code/find-qr-code.component';
import { HighscorePageComponent } from './highscore-page/highscore-page.component';
import { LoginComponent } from './login/login.component';
import { GameEndComponent } from './game-end/game-end.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MemoryComponent } from './memory/memory.component';
import { AdminComponent } from './admin/admin.component';

// use inbetween components for when between tasks?
// TODO router guard to prevent skipping tasks

// todo routes to const?
const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent, data: {animation: 'slideIn'} },
  { path: 'accesscard', component: AccessCardComponent, data: {animation: 'slideIn2'} },
  { path: 'snake', component: SnakeComponent, data: {animation: 'slideIn'} },
  { path: 'autocode', component: AutoCodeComponent, data: {animation: 'slideIn2'} },
  { path: 'memory', component: MemoryComponent, data: {animation: 'slideIn'} },
  { path: 'findqrcode', component: FindQrCodeComponent, data: {animation: 'slideIn2'} },
  { path: 'end', component: GameEndComponent, data: {animation: 'slideIn'} },
  { path: 'highscore', component: HighscorePageComponent },
  { path: 'admin', component: AdminComponent },
  // { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
