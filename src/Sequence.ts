import { BoardCard } from "./BoardCard";

/**
 * A Sequence is 5 cards in a row
 */
export class Sequence {
  constructor(
    //board: Board,
    readonly cards: BoardCard[]
  ) {
    //  TODO: validate that sequence at most only overlaps with 1 card of another sequence from the board
  }
}
