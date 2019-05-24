import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as Proton from 'proton-js/build/proton.js';

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
      'assets/cardBG.jpg',
      'assets/login.jpg',
      'assets/qrCode.png',
      'assets/memoryBG.png',
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
    // document.body.requestFullscreen();
    this.router.navigate(['login']);
  }

  payToWin() {
    if ((window as any).PaymentRequest) {
      const request = this.initPaymentRequest();
      request.show().then((instrumentResponse: PaymentResponse) => {
        const name = instrumentResponse.details.cardholderName;
        setTimeout(() => {
          instrumentResponse.complete('fail').then(() => {
            // console.log('done!', this.a);
          }).catch((err) => {
            console.log(err);
          });
          alert('Ikke smart å bare gi fra seg kortet ditt som det ' + name + '!');
        }, 2000);
      })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert('Not supported, switch to Chrome');
    }
  }

  initPaymentRequest() {
    const networks = ['mastercard', 'visa'];
    const types = ['debit', 'credit', 'prepaid'];
    const supportedInstruments = [{
      supportedMethods: 'basic-card',
      data: { supportedNetworks: networks, supportedTypes: types },
    }];

    const details = {
      total: { label: 'Pay 2 Win', amount: { currency: 'USD', value: '1.00' } },
      displayItems: [
        {
          label: 'Russian mob fee',
          amount: { currency: 'USD', value: '2.00' },
        },
        {
          label: 'GDPR fee',
          amount: { currency: 'USD', value: '10.00' },
        },
      ],
    };

    return new PaymentRequest(supportedInstruments, details);
  }

}
