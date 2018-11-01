import { Component, OnInit } from '@angular/core';
import { Card } from '../card';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RankValidator, ParentErrorStateMatcher } from '../custom_validators/rank.validator';
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  Suits: string[] = ['♣', '♦', '♠', '♥'];
  Ranks: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  cards: Card[] = [];
  pile: Card[];
  hand: Card[] = [];
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  filters = this.fb.group({
    suits: [this.Suits, Validators.required],
    size: [5, [
      Validators.required,
      Validators.min(1),
      Validators.max(42)
    ]],
    ranks: this.fb.group({
      minRank: ['A', [
        Validators.required,
        RankValidator.validateRank
      ]],
      maxRank: ['K', [
        Validators.required,
        RankValidator.validateRank
      ]]
    }, { validator: RankValidator.validateMinMax })
  });

  validation_messages = {
    'suits': [
      { type: 'required', message: 'Please choose at least one suit' }
    ],
    'size': [
      { type: 'required', message: 'Please choose at least one card' },
      { type: 'min', message: 'Please choose at least one card' },
      { type: 'max', message: 'Please choose at most 42 cards' }
    ],
    'minRank': [
      { type: 'required', message: 'Maximum rank required' },
      { type: 'validateRank', message: 'Rank must be valid, e.g. A, 3, J' }
    ],
    'maxRank': [
      { type: 'required', message: 'Minimum rank required' },
      { type: 'validateRank', message: 'Rank must be valid, e.g. A, 3, J' },
      { type: 'validateMinMax', message: 'Must be greater than or equal to min card value' }
    ]
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.Suits.forEach(function (suit) {
      //console.log(this.Ranks);
      this.Ranks.forEach(function (rank) {
        var card = new Card(rank, suit);
        this.cards.push(card);
      }, this);
    }, this);
  }
  getRandom(arr, n) {
    const shuffled = arr.sort(() => .5 - Math.random());
    let ret = shuffled.slice(0, n);
    //console.log(ret);
    return ret;
  }
  draw() {
    const size = this.filters.get('size').value; 
    this.hand = this.getRandom(this.cards, size);
    this.pile = this.cards.filter((card) => !this.hand.includes(card)).sort((a, b) =>
      (a.suit != b.suit) ? this.Suits.indexOf(a.suit) - this.Suits.indexOf(b.suit) : this.Ranks.indexOf(a.rank) - this.Ranks.indexOf(b.rank)
    );
  }
}
