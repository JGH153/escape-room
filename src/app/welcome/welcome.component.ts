import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'deg-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.preLoadImages();
  }

  preLoadImages() {
    const paths = new Array(
      'assets/computas-logo.svg',
      'assets/profiles/cardBG.jpg',
      'assets/profiles/login.jpg',
      'assets/profiles/qrCode.png',
      'assets/profiles/christine.jpg',
      'assets/profiles/1.jpg',
      'assets/profiles/2.jpg',
      'assets/profiles/3.jpg',
      'assets/profiles/ai.jpg',
      'assets/profiles/trond.jpg',
      'assets/profiles/trond2.jpg',
    );

    const images = new Array();

    paths.forEach(currentImgPath => {
      const image = new Image();
      image.src = currentImgPath;
      images.push(image);
    });
  }

  start() {
    this.router.navigate(['login']);
  }

}
