import { Card } from "./Card";
import { Deck } from "./Deck";

export class Player {
  private currentCards: Card[] = [];
  constructor(public readonly color: string) {}

  getCurrentCards() {
    return this.currentCards;
  }

  playCard(card: Card, deck: Deck) {
    this.currentCards = this.currentCards.filter(
      (c) => !(c.rank === card.rank && c.suite === card.suite)
    );

    this.currentCards.push(deck.popCard()!);

    console.log("player", this.color, this.currentCards);
  }

  drawCards(deck: Deck) {
    console.log("player", this.color, this.currentCards);

    if (this.currentCards.length === 5) {
      return;
    }

    this.currentCards.push(deck.popCard()!);
    this.currentCards.push(deck.popCard()!);
    this.currentCards.push(deck.popCard()!);
    this.currentCards.push(deck.popCard()!);
    this.currentCards.push(deck.popCard()!);
  }
}
