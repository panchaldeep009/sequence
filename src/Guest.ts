import Peer from "peerjs";
import { v4 } from "uuid";
import { ConnectionEventManager } from "./ConnectionEventManager";

export class Guest {
  public peer: Peer;
  public readonly events = new ConnectionEventManager();

  constructor() {
    const guestId =
      localStorage.getItem("sequence-game-guest-id") || `sequence-game-${v4()}`;
    localStorage.setItem("sequence-game-guest-id", guestId);

    this.peer = new Peer(guestId);
  }

  connect(hostId: string) {
    const connection = this.peer.connect(hostId);
    connection.on("open", () => {
      this.events.setConnection(connection);
    });
  }

  destroy() {
    this.peer.destroy();
  }

  get id() {
    return this.peer.id;
  }

  ping() {
    this.events.send({
      type: "ping",
    });
  }
}
