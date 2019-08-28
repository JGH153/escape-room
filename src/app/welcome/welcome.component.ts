import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../services/master.service';

@Component({
  selector: 'deg-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router, private masterService: MasterService) { }

  canPayToWin = false;

  showIntro = true;

  isIosNotSafari = false;

  ngOnInit() {
    this.preLoadImages();
    if ((window as any).PaymentRequest) {
      this.canPayToWin = true;
    }

    setTimeout(() => {
      this.showIntro = false;
      // console.log('now');
    }, 19500);

    if (navigator.userAgent.match('CriOS')) {
      this.isIosNotSafari = true;
    }

  }

  preLoadImages() {
    const paths = new Array(
      'assets/computas-logo.svg',
      'assets/cardBG.jpg',
      'assets/login.jpg',
      'assets/qrCode.png',
      'assets/memoryBG.png',
      'assets/loading.gif',
      'assets/profiles/christine.jpg',
      'assets/profiles/1.jpg',
      'assets/profiles/2.jpg',
      'assets/profiles/3.jpg',
      'assets/profiles/ai.jpg',
      'assets/profiles/trond.jpg',
      'assets/design/home.png',
      'assets/design/kode.jpg',
      'assets/design/memory.jpg',
      'assets/design/people0.jpg',
      'assets/design/people1.jpg',
      'assets/design/people2.jpg',
      'assets/design/people3.jpg',
      'assets/design/people4.jpg',
      'assets/design/winBlue.png',
      'assets/design/winGreen.png',
      'assets/design/winRed.png',
      'assets/design/winYellow.png',
      'assets/cp-logo-big.gif',
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

  clickedIntro() {
    this.showIntro = false;
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
          amount: { currency: 'RUB', value: '2.00' },
        },
        {
          label: 'GDPR fee',
          amount: { currency: 'EUR', value: '10.00' },
        },
        {
          label: 'Phishing protection',
          amount: { currency: 'NGN', value: '1336.00' },
        },
      ],
    };

    return new PaymentRequest(supportedInstruments, details);
  }

}
