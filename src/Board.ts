import { BoardCard } from "./BoardCard";
import { Deck } from "./Deck";
import { Player } from "./Player";
import { WildCard } from "./WildCard";

/**
 * A Sequence is 5 cards in a row
 */
class Sequence {
  constructor(
    //board: Board,
    readonly cards: BoardCard[]
  ) {
    //  TODO: validate that sequence at most only overlaps with 1 card of another sequence from the board
  }
}

type Coordinate = [number, number];

const hasMatchingPosition = (p1: Coordinate, p2: Coordinate): boolean =>
  p1[0] === p2[0] && p1[1] === p2[1];

export class Board {
  public readonly cards: BoardCard[] = [];
  public readonly deck = new Deck([...new Deck().cards, ...new Deck().cards]);
  public activePlayerIndex = 0;
  public sequences: Sequence[] = [];

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
    const boardCard = this.cards.find(({ card, position, takenPlayer }) => {
      if (card instanceof WildCard) {
        return false;
      }

      return card && position[0] === x && position[1] === y && !takenPlayer;
    });

    const { card } = boardCard || {};

    if (!boardCard || !card || card instanceof WildCard) {
      return;
    }

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

    this.activePlayer.playCard(card, this.deck);
    boardCard.takenPlayer = this.activePlayer;
    // const sequenceFound = this.checkSequence();
    const sequenceFound = this.checkForSequence();

    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
  }

  /**
   * For the active player, check if they have established a new 5 card sequence.
   */
  checkForSequence(): boolean {
    const activePlayerCards = this.cards.filter((card) => {
      if (card instanceof WildCard) {
        return false;
      }
      const { takenPlayer } = card;
      return takenPlayer === this.activePlayer;
    });

    const sequenceFromVector = (
      card: BoardCard,
      vector: Coordinate,
      count: number = 1
    ): Sequence | null => {
      const nextCardPosition: Coordinate = [
        card.position[0] + vector[0],
        card.position[1] + vector[1],
      ];
      const nextSequenceCard = activePlayerCards.find((card) =>
        hasMatchingPosition(card.position, nextCardPosition)
      );
      return null;
    };

    activePlayerCards.forEach((currentCard) => {
      const [row, column] = currentCard.position;

      const nearbyCardPositions = [
        [row, column + 1],
        [row, column - 1],
        [row + 1, column],
        [row - 1, column],
        [row + 1, column + 1],
        [row - 1, column - 1],
        [row + 1, column - 1],
        [row - 1, column + 1],
      ];

      const nearbyPlayerCards = activePlayerCards.filter((card) => {
        return nearbyCardPositions.some(([row, column]) => {
          return card.position[0] === row && card.position[1] === column;
        });
      });

      nearbyPlayerCards.forEach((nearbyCard) => {
        // const vector = [nearbyCard.position[0] - row, nearbyCard.position[1] - column]
        const directionX = nearbyCard.position[0] - row;
        const directionY = nearbyCard.position[1] - column;

        const nextCard = activePlayerCards.find((card) => {
          return (
            card.position[0] === nearbyCard.position[0] + directionX &&
            card.position[1] === nearbyCard.position[1] + directionY
          );
        });

        if (!nextCard) {
          return;
        }

        const nextToNextCard = activePlayerCards.find((card) => {
          return (
            card.position[0] === nextCard.position[0] + directionX &&
            card.position[1] === nextCard.position[1] + directionY
          );
        });

        if (!nextToNextCard) {
          return;
        }

        const nextToNextToNextCard = activePlayerCards.find((card) => {
          return (
            card.position[0] === nextToNextCard.position[0] + directionX &&
            card.position[1] === nextToNextCard.position[1] + directionY
          );
        });

        if (!nextToNextToNextCard) {
          return;
        }

        // A sequence of 5 cards has been identified, store it!
        this.sequences.push(
          new Sequence([
            currentCard,
            nearbyCard,
            nextCard,
            nextToNextCard,
            nextToNextToNextCard,
          ])
        );
      });
    });

    return false;
  }

  checkSequence() {
    const activePlayerCards = this.cards.filter(({ takenPlayer }) => {
      return takenPlayer === this.activePlayer;
    });

    activePlayerCards.forEach((currentCard) => {
      if (currentCard.card instanceof WildCard) {
        return;
      }

      const [row, column] = currentCard.position;

      const nearbyCardPositions = [
        [row, column + 1],
        [row, column - 1],
        [row + 1, column],
        [row - 1, column],
        [row + 1, column + 1],
        [row - 1, column - 1],
        [row + 1, column - 1],
        [row - 1, column + 1],
      ];

      const nearbyPlayerCards = activePlayerCards.filter((card) => {
        return nearbyCardPositions.some(([row, column]) => {
          return card.position[0] === row && card.position[1] === column;
        });
      });

      nearbyPlayerCards.forEach((nearbyCard) => {
        // const vector = [nearbyCard.position[0] - row, nearbyCard.position[1] - column]
        const directionX = nearbyCard.position[0] - row;
        const directionY = nearbyCard.position[1] - column;

        const nextCard = activePlayerCards.find((card) => {
          return (
            card.position[0] === nearbyCard.position[0] + directionX &&
            card.position[1] === nearbyCard.position[1] + directionY
          );
        });

        if (!nextCard) {
          return;
        }

        const nextToNextCard = activePlayerCards.find((card) => {
          return (
            card.position[0] === nextCard.position[0] + directionX &&
            card.position[1] === nextCard.position[1] + directionY
          );
        });

        if (!nextToNextCard) {
          return;
        }

        const nextToNextToNextCard = activePlayerCards.find((card) => {
          return (
            card.position[0] === nextToNextCard.position[0] + directionX &&
            card.position[1] === nextToNextCard.position[1] + directionY
          );
        });

        if (!nextToNextToNextCard) {
          return;
        }

        // A sequence of 5 cards has been identified, store it!
        this.sequences.push(
          new Sequence([
            currentCard,
            nearbyCard,
            nextCard,
            nextToNextCard,
            nextToNextToNextCard,
          ])
        );
      });
    });
  }
}
