import { RANKS } from "./Ranks";
import { Suite } from "./Suite";

export class Card {
  constructor(
    public readonly suite: Suite,
    public readonly rank: (typeof RANKS)[number]
  ) {}
}
