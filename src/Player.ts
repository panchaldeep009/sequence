import { Card } from "./Card";
import { Deck } from "./Deck";
import { WildCard } from "./WildCard";

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
  }

  hasCard(card: Card | WildCard) {
    return this.currentCards.some(
      (c) =>
        !(card instanceof WildCard) &&
        c.rank === card.rank &&
        c.suite === card.suite
    );
  }

  drawCards(deck: Deck) {
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
