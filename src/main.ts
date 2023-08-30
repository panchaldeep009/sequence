import "./style.css";
import P5 from "p5";

const REAL_CARD_SIZE = {
  WIDTH: 2.5,
  HEIGHT: 3.5,
};

const CARD_DIMENSIONS_RATIO = REAL_CARD_SIZE.HEIGHT / REAL_CARD_SIZE.WIDTH;

const GAP = 8;

const cardSizeWidth = (document.body.clientHeight - 11 * GAP) / 10;
const cardSizeHeight = cardSizeWidth * CARD_DIMENSIONS_RATIO;

enum Suite {
  SPACE = "♠",
  HEART = "♥",
  DIAMOND = "♦",
  CLUB = "♣",
}

const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"] as const;

class Card {
  constructor(
    public readonly suite: Suite,
    public readonly rank: (typeof RANKS)[number]
  ) {}
}

class BoardCard {
  constructor(
    public readonly card: Card | WildCard,
    public readonly position: [number, number],
    public takenPlayer: Player | null = null
  ) {}
}

class Player {
  private currentCards: Card[] = [];
  constructor(
    public readonly color: string,
    public readonly deck: Deck,
    public readonly board: Board
  ) {
    this.currentCards.push(deck.popCard()!);
    this.currentCards.push(deck.popCard()!);
    this.currentCards.push(deck.popCard()!);
  }

  getCurrentCards() {
    return this.currentCards;
  }

  playCard(x: number, y: number) {
    const boardCard = this.board.cards.find(
      ({ card, position, takenPlayer }) => {
        if (card instanceof WildCard) {
          return false;
        }

        const userHasCard = this.currentCards.find((currentCard) => {
          return (
            card.rank === currentCard.rank && card.suite === currentCard.suite
          );
        });

        return !(
          card &&
          position[0] === x &&
          position[1] === y &&
          !takenPlayer &&
          userHasCard
        );
      }
    );

    if (!boardCard) {
      return;
    }

    this.currentCards = this.currentCards.filter(
      (card) =>
        !(
          !(boardCard.card instanceof WildCard) &&
          card.rank === boardCard.card.rank &&
          card.suite === boardCard.card.suite
        )
    );

    this.currentCards.push(this.deck.popCard()!);
  }
}

class WildCard {}

class Deck {
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

class Board {
  public readonly cards: BoardCard[] = [];
  public readonly deck = new Deck([...new Deck().cards, ...new Deck().cards]);

  constructor(public readonly players: Player[] = []) {}

  arrangeCards() {
    const possibleCard = [
      ...new Deck().cards.filter((card) => card.rank !== "J"),
      ...new Deck().cards.filter((card) => card.rank !== "J"),
    ];

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (
          (i === 0 && j === 0) ||
          (i === 9 && j === 9) ||
          (i === 0 && j === 9) ||
          (i === 9 && j === 0)
        ) {
          this.cards.push(new BoardCard(new WildCard(), [i, j], null));
          continue;
        }

        this.cards.push(new BoardCard(possibleCard.pop()!, [i, j], null));
      }
    }
  }
}

const sketch = (p5: P5) => {
  const board = new Board([
    new Player("blue", deck, board),
    new Player("green", deck, board),
  ]);

  const deck = new Deck([...new Deck().cards, ...new Deck().cards]);

  p5.setup = () => {
    p5.createCanvas(cardSizeHeight * 10 + 11 * GAP, document.body.clientHeight);
  };

  p5.draw = () => {
    p5.background(3);

    // draw board cards
    board.cards.forEach((boardCard) => {
      const {
        card,
        position: [x, y],
        takenPlayer,
      } = boardCard;
      p5.fill(255);
      p5.stroke(0, 0);

      p5.rect(
        x * (cardSizeHeight + GAP),
        y * (cardSizeWidth + GAP),
        cardSizeHeight,
        cardSizeWidth
      );

      p5.fill(0);

      p5.textSize(32);

      if (card instanceof WildCard) {
        // Rotate the text 90 degrees counterclockwise
        p5.text(
          "Wild",
          x * (cardSizeHeight + GAP) + 10,
          y * (cardSizeWidth + GAP) + 20,
          cardSizeHeight,
          cardSizeWidth
        );
      } else {
        if (card.suite === Suite.HEART || card.suite === Suite.DIAMOND) {
          p5.fill(255, 0, 0);
        }
        p5.text(
          `${card.rank} ${card.suite}`,
          x * (cardSizeHeight + GAP) + 10,
          y * (cardSizeWidth + GAP) + 10,
          cardSizeHeight,
          cardSizeWidth
        );
      }

      if (takenPlayer) {
        p5.fill(takenPlayer.color);
        p5.ellipse(
          x * (cardSizeHeight + GAP) + cardSizeHeight / 2,
          y * (cardSizeWidth + GAP) + cardSizeWidth / 2,
          cardSizeWidth / 2,
          cardSizeWidth / 2
        );
      }
    });
  };

  p5.mouseClicked = (e) => {
    if (!e) {
      return;
    }

    const x = Math.floor(p5.mouseX / (cardSizeHeight + GAP));
    const y = Math.floor(p5.mouseY / (cardSizeWidth + GAP));

    const card = board.cards.find(
      (boardCard) => boardCard.position[0] === x && boardCard.position[1] === y
    );

    const [player1, player2] = players;
    if (!card || !player1 || !player2 || card.takenPlayer) {
      return;
    }

    if (p5.keyIsPressed) {
      card.takenPlayer = player2;
      return;
    }

    card.takenPlayer = player1;
  };
};

new P5(sketch);
