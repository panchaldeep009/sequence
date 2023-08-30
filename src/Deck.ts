import { Card } from "./Card";
import { RANKS } from "./Ranks";
import { Suite } from "./Suite";

export class Deck {
  public cards: Card[] = [];

  constructor(cards?: Card[]) {
    if (cards) {
      this.cards = cards;
      return;
    }

    this.cards = RANKS.flatMap((rank) => [
      new Card(Suite.SPACE, rank),
      new Card(Suite.HEART, rank),
      new Card(Suite.DIAMOND, rank),
      new Card(Suite.CLUB, rank),
    ]).sort(() => Math.random() - 0.5);
  }

  filterDeck(filter: (card: Card) => boolean) {
    this.cards = this.cards.filter(filter);
    return this;
  }

  popCard(card?: Card) {
    if (!card) return this.cards.pop();

    this.cards = this.cards.filter(
      (c) => !(c.rank === card.rank && c.suite === card.suite)
    );
    return card;
  }

  shuffle() {
    this.cards = this.cards.sort(() => Math.random() - 0.5);
    return this;
  }
}
