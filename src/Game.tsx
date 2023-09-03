import { Board } from "./Board";
import { Player } from "./Player";
import { Suite } from "./Suite";
import { Team } from "./Team";
import { WildCard } from "./WildCard";
import P5 from "p5";

const REAL_CARD_SIZE = {
  WIDTH: 2.5,
  HEIGHT: 3.5,
};

const CARD_DIMENSIONS_RATIO = REAL_CARD_SIZE.HEIGHT / REAL_CARD_SIZE.WIDTH;

const cardSizeWidth = document.body.clientHeight / 10;
const cardSizeHeight = cardSizeWidth * CARD_DIMENSIONS_RATIO;

const gameSketch = (p5: P5) => {
  const blueTeam = new Team("blue");
  const greenTeam = new Team("green");
  const player1 = new Player(blueTeam);
  const player2 = new Player(greenTeam);
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
        team: takenPlayer,
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

      if (board.activePlayer.hasCard(card)) {
        p5.stroke(board.activePlayer.team.color);
        p5.strokeWeight(4);
        p5.fill(0, 0);
        const margin = 6;
        p5.rect(
          column * cardSizeHeight + margin,
          row * cardSizeWidth + margin,
          cardSizeHeight - margin * 2,
          cardSizeWidth - margin * 2
        );
      }

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

    board.playCard(x, y);
  };
};

// new P5(gameSketch);

export const Game: React.FC<{ connection: Peer }> = ({ roomId }) => {
  return <div id="game"></div>;
};
