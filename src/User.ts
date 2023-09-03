import { Player } from "./Player";

export class User {
  public name: string;
  public player: Player;

  constructor(name: string, player: Player) {
    this.name = name;
    this.player = player;
  }
}
