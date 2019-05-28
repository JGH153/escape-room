import { Component, OnInit } from '@angular/core';
import { MasterService } from './services/master.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'deg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isLoading;

  constructor(private masterService: MasterService, private router: Router) { }

  ngOnInit() {
    this.isLoading = this.masterService.isLoading;

    // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    fromEvent(window, 'resize')
      .pipe(debounceTime(150))
      .subscribe({
        next: () => {
          this.updateVh();
        }
      });
    this.updateVh();

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  updateVh() {
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    console.log(window.innerHeight);
    document.documentElement.style.setProperty('--vh1', `${vh}px`);
  }

}
