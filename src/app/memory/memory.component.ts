import { Component, OnInit } from '@angular/core';
import { MasterService } from '../services/master.service';
import { Stages } from '../models/stages';

interface Card {
  name: string;
  url: string;
  id?: number;
}

@Component({
  selector: 'deg-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss']
})
export class MemoryComponent implements OnInit {

  allCardsUnique: Card[] = [
    { name: 'GCP', url: 'gcp.png' },
    { name: 'Angular', url: 'angular1.png' },
    // { name: 'Azure', url: 'azure.png' },
    { name: 'Firebase', url: 'firebase.svg' },
    { name: 'React', url: 'react.png' },
    // { name: 'Vue', url: 'vue1.png' },
    // { name: 'Docker', url: 'docker.png' },
    { name: 'Kubernetes', url: 'kubernetes.png' },
    // { name: 'TypeScript', url: 'ts.png' },
    // { name: 'Git', url: 'git.png' },
    { name: 'Computas', url: 'computas.png' },
  ];

  // with duplicates
  allCardsTotal: Card[] = [];
  cards: Card[] = [];
  selectedCards: Card[] = [];

  showIntro = true;
  showOutro = false;

  constructor(private masterService: MasterService) { }

  ngOnInit() {

    const cards1 = [...this.allCardsUnique];
    const cards2 = [...this.allCardsUnique];
    this.allCardsTotal = this.shuffleCards(cards1.concat(cards2));

    // use array index as id
    this.allCardsTotal = this.allCardsTotal.map((current, index) => {
      return {
        ...current,
        id: index
      };
    });

    this.cards = [...this.allCardsTotal];

    this.preLoadImages();
  }

  gotoNextTask() {
    this.masterService.gotoStage(Stages.FindQrCode);
  }

  closeIntro() {
    this.showIntro = false;
  }

  // todo pipe
  cardVisible(id: Card['id']) {
    return this.selectedCards.some(current => current.id === id);
  }

  clickedCard(card: Card) {
    if (this.selectedCards.length >= 2) {
      this.selectedCards = [];
    }

    if (this.selectedCards.length === 0) {
      this.selectedCards.push({ ...card });
    } else if (this.selectedCards.length === 1) {
      this.selectedCards.push({ ...card });
      if (this.selectedCardsSame()) {
        setTimeout(() => {
          this.removeCardByName(card.name);
        }, 200);
      }
    } else {
      console.warn('Error of some kind!');
    }
  }

  private removeCardByName(name: Card['name']) {
    this.cards = this.cards.filter(current => current.name !== name);

    if (this.cards.length === 0) {
      this.showOutro = true;
    }
  }

  private selectedCardsSame(): boolean {
    if (this.selectedCards.length !== 2) {
      return false;
    }
    return this.selectedCards[0].name === this.selectedCards[1].name;
  }

  private preLoadImages() {
    const paths = this.allCardsUnique.map(current => 'assets/memory/' + current.url);

    const images = new Array();

    paths.forEach(currentImgPath => {
      const image = new Image();
      image.src = currentImgPath;
      images.push(image);
    });
  }

  // from stackoverflow
  private shuffleCards(cards: Card[]) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

}
