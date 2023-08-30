import { Card } from "./Card";
import { Player } from "./Player";
import { WildCard } from "./WildCard";

export class BoardCard {
  constructor(
    public readonly card: Card | WildCard,
    public readonly position: [number, number],
    public takenPlayer: Player | null = null
  ) {}
}
