import { Component, OnInit } from '@angular/core';
import { Card } from '../card';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  Suits: string[] = ['♣', '♦', '♠', '♥'];
  Ranks: string[] = ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  cards: Card[] = [];
  pile: Card[];
  hand: Card[] = [];
  filters = this.fb.group({
    suits: [''],
    size: ['5'],
    maxRank: ['K'],
    minRank: ['A']
  })

  constructor(private fb: FormBuilder) {
    this.Suits.forEach(function (suit) {
      console.log(this.Ranks);
      this.Ranks.forEach(function (rank) {
        var card = new Card(rank, suit);
        this.cards.push(card);
      }, this);
    }, this);
    //console.log(this.cards);
  }

  ngOnInit() {

  }
  getRandom(arr, n) {
    const shuffled = arr.sort(() => .5 - Math.random());
    let ret = shuffled.slice(0, n);
    console.log(ret);
    return ret;
  }
  draw() {
    console.log('draw');
    this.hand = this.getRandom(this.cards, 5);
    this.pile = this.cards.filter((card) => !this.hand.includes(card)).sort((a, b) =>
      (a.suit != b.suit) ? this.Suits.indexOf(a.suit) - this.Suits.indexOf(b.suit) : this.Ranks.indexOf(a.rank) - this.Ranks.indexOf(b.rank)
    );
  }
}
