import { Component, OnInit } from '@angular/core';
import { Card } from '../shared/card.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RankValidator, ParentErrorStateMatcher } from '../custom_validators/rank.validator';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  readonly SUITS: string[] = ['♣', '♦', '♠', '♥'];
  readonly RANKS: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  cards: Card[] = [];
  pile: Card[];
  hand: Card[] = [];
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  filters: FormGroup = this.fb.group({
    suits: [this.SUITS, Validators.required],
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
    // generate the initial deck
    this.SUITS.forEach(function (suit) {
      this.RANKS.forEach(function (rank) {
        var card = new Card(rank, suit);
        this.cards.push(card);
      }, this);
    }, this);
  }

  /**
   * get a random hand of cards based on filtering criterias
   * 
   * @param arr - array of Cards
   * @param n - size of hand
   * @param suits - selected suits
   * @param minRank - minimum rank
   * @param maxRank - maximum rank
   */
  getRandom(arr, n, suits, minRank, maxRank) {
    arr = arr.filter((x) => suits.includes(x.suit) && this.RANKS.indexOf(minRank) <= this.RANKS.indexOf(x.rank) && this.RANKS.indexOf(x.rank) <= this.RANKS.indexOf(maxRank));
    const shuffled = arr.sort(() => .5 - Math.random());
    let ret = shuffled.slice(0, n);
    return ret;
  }

  /**
   * draw a hand of card from deck
   */
  draw() {
    const size = this.filters.get('size').value; 
    const suits = this.filters.get('suits').value;
    const minRank = this.filters.get(['ranks', 'minRank']).value;
    const maxRank = this.filters.get(['ranks', 'maxRank']).value;
    // update hand 
    this.hand = this.getRandom(this.cards, size, suits, minRank, maxRank);
    // update pile and sort
    this.pile = this.cards.filter((card) => !this.hand.includes(card)).sort((a, b) =>
      (a.suit != b.suit) ? this.SUITS.indexOf(a.suit) - this.SUITS.indexOf(b.suit) : this.RANKS.indexOf(a.rank) - this.RANKS.indexOf(b.rank)
    );
  }
}
