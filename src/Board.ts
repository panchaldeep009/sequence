import { BoardCard } from "./BoardCard";
import { Deck } from "./Deck";
import { Player } from "./Player";
import { WildCard } from "./WildCard";

export class Board {
  public readonly cards: BoardCard[] = [];
  public readonly deck = new Deck([...new Deck().cards, ...new Deck().cards]);
  public activePlayerIndex = 0;

  get activePlayer() {
    const player = this.players[this.activePlayerIndex];
    if (!player) {
      throw new Error("No active player");
    }
    return player;
  }

  constructor(public readonly players: Player[] = []) {
    this.arrangeCards();
    if (!players[0]) {
      throw new Error("At least 2 players are required");
    }
  }

  arrangeCards() {
    const possibleCard = [
      ...new Deck().cards.filter((card) => card.rank !== "J"),
      ...new Deck().cards.filter((card) => card.rank !== "J"),
    ];

    const edges = [0, 9];

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (edges.includes(j) && edges.includes(i)) {
          this.cards.push(new BoardCard(new WildCard(), [i, j], null));
          continue;
        }

        this.cards.push(new BoardCard(possibleCard.pop()!, [i, j], null));
      }
    }
  }

  playCard(x: number, y: number) {
    console.log("board cards", this.cards);
    const boardCard = this.cards.find(({ card, position, takenPlayer }) => {
      if (card instanceof WildCard) {
        return false;
      }

      return !(card && position[0] === x && position[1] === y && !takenPlayer);
    });

    const { card } = boardCard || {};

    if (!boardCard || !card || card instanceof WildCard) {
      return;
    }

    console.log("board", card.rank, card.suite);

    const userHasCard = this.activePlayer
      .getCurrentCards()
      .find((currentCard) => {
        return (
          card.rank === currentCard.rank && card.suite === currentCard.suite
        );
      });

    if (!userHasCard) {
      return;
    }

    console.log("board", card.rank, card.suite);

    this.activePlayer.playCard(card, this.deck);
    boardCard.takenPlayer = this.activePlayer;
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
  }
}
