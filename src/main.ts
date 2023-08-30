import { Board } from "./Board";
import { Player } from "./Player";
import { Suite } from "./Suite";
import { WildCard } from "./WildCard";
import "./style.css";
import P5 from "p5";

const REAL_CARD_SIZE = {
  WIDTH: 2.5,
  HEIGHT: 3.5,
};

const CARD_DIMENSIONS_RATIO = REAL_CARD_SIZE.HEIGHT / REAL_CARD_SIZE.WIDTH;

const cardSizeWidth = document.body.clientHeight / 10;
const cardSizeHeight = cardSizeWidth * CARD_DIMENSIONS_RATIO;

const sketch = (p5: P5) => {
  const player1 = new Player("blue");
  const player2 = new Player("green");
  const board = new Board([player1, player2]);

  p5.setup = () => {
    player1.drawCards(board.deck);
    player2.drawCards(board.deck);

    p5.createCanvas(cardSizeHeight * 10, document.body.clientHeight);
  };

  p5.draw = () => {
    p5.background(3);

    // draw board cards
    board.cards.forEach((boardCard) => {
      const {
        card,
        position: [row, column],
        takenPlayer,
      } = boardCard;
      p5.fill(255);
      p5.stroke(0);
      p5.strokeWeight(6);

      p5.rect(
        column * cardSizeHeight,
        row * cardSizeWidth,
        cardSizeHeight,
        cardSizeWidth
      );

      p5.stroke(0, 0);
      p5.fill(0);

      p5.textSize(32);

      if (card instanceof WildCard) {
        // Rotate the text 90 degrees counterclockwise
        p5.text(
          "Wild",
          column * cardSizeHeight + 10,
          row * cardSizeWidth + 20,
          cardSizeHeight,
          cardSizeWidth
        );
      } else {
        if (card.suite === Suite.HEART || card.suite === Suite.DIAMOND) {
          p5.fill(255, 0, 0);
        }
        p5.text(
          `${card.rank} ${card.suite}`,
          column * cardSizeHeight + 10,
          row * cardSizeWidth + 10,
          cardSizeHeight,
          cardSizeWidth
        );
      }

      if (takenPlayer) {
        p5.fill(takenPlayer.color);
        p5.ellipse(
          column * cardSizeHeight + cardSizeHeight / 2,
          row * cardSizeWidth + cardSizeWidth / 2,
          cardSizeWidth / 2,
          cardSizeWidth / 2
        );
      }
    });
  };

  p5.mouseClicked = () => {
    const y = Math.floor(p5.mouseX / cardSizeHeight);
    const x = Math.floor(p5.mouseY / cardSizeWidth);

    console.log(x, y);

    board.playCard(x, y);
  };
};

new P5(sketch);
