import { BoardCard } from "./BoardCard";
import { Coordinate, hasMatchingPosition } from "./Cordinate";
import { Deck } from "./Deck";
import { Player } from "./Player";
import { Sequence } from "./Sequence";
import { Team } from "./Team";
import { WildCard } from "./WildCard";

export class Board {
  public readonly cards: BoardCard[] = [];
  public readonly deck = new Deck([...new Deck().cards, ...new Deck().cards]);
  private activePlayerIndex = 0;

  private sequences: Map<Team, Sequence[]> = new Map();

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
    const boardCard = this.cards.find(
      ({ card, position, team: takenPlayer }) => {
        if (card instanceof WildCard) {
          return false;
        }

        return card && position[0] === x && position[1] === y && !takenPlayer;
      }
    );

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
    boardCard.team = this.activePlayer.team;
    const activeTeamSequences = this.checkForSequence();

    const sequencesRequired = [3, 6, 8, 9].includes(this.players.length)
      ? 1
      : 2;

    if (activeTeamSequences.length >= sequencesRequired) {
      console.log("WINNER", this.activePlayer.team.color);
      return;
    }

    this.nextTurn();
  }

  nextTurn() {
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
  }

  checkForSequence() {
    const activePlayerCards = this.cards.filter((boardCard) => {
      const { team, card } = boardCard;
      return team === this.activePlayer.team || card instanceof WildCard;
    });

    const sequenceFromVector = (
      cardsInSequence: BoardCard[],
      vector: Coordinate
    ): Sequence | null => {
      if (cardsInSequence.length === 5) {
        return new Sequence(cardsInSequence);
      }

      const lastCard = cardsInSequence[cardsInSequence.length - 1];

      if (!lastCard) {
        return null;
      }

      const nextCardPosition: Coordinate = [
        lastCard.position[0] + vector[0],
        lastCard.position[1] + vector[1],
      ];

      const nextSequenceCard = activePlayerCards.find((card) =>
        hasMatchingPosition(card.position, nextCardPosition)
      );

      if (nextSequenceCard) {
        return sequenceFromVector(
          [...cardsInSequence, nextSequenceCard],
          vector
        );
      }

      return null;
    };

    const sequences = activePlayerCards.reduce((currentSequences, card) => {
      const vectors: Coordinate[] = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ];

      const cardSequences = vectors
        .map((vector) => sequenceFromVector([card], vector))
        .filter((sequence): sequence is Sequence => sequence !== null);

      return [...currentSequences, ...cardSequences];
    }, [] as Sequence[]);

    const validateSequence = sequences.reduce((currentSequences, sequence) => {
      const overlappingSequences = currentSequences.filter(
        (currentSequence) => {
          const overlappingCards = sequence.cards.filter((card) =>
            currentSequence.cards.find((sequenceCard) =>
              hasMatchingPosition(card.position, sequenceCard.position)
            )
          );

          return overlappingCards.length > 1;
        }
      );

      if (overlappingSequences.length > 0) {
        return currentSequences;
      }

      return [...currentSequences, sequence];
    }, [] as Sequence[]);

    this.sequences.set(this.activePlayer.team, validateSequence);

    console.log("SEQUENCES", validateSequence);

    return validateSequence;
  }
}
