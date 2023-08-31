import { Card } from "./Card";
import { Team } from "./Team";
import { WildCard } from "./WildCard";

export class BoardCard {
  constructor(
    public readonly card: Card | WildCard,
    public readonly position: [number, number],
    public team: Team | null = null
  ) {}
}
