import Peer, { DataConnection } from "peerjs";
import { v4 } from "uuid";
import { ConnectionEventManager, eventSchema } from "./EventManager";

export class Guest {
  public peer: Peer;
  private connection: DataConnection | null = null;
  public readonly events = new ConnectionEventManager();

  constructor(hostId: string) {
    const guestId =
      localStorage.getItem("sequence-game-guest-id") || `sequence-game-${v4()}`;
    localStorage.setItem("sequence-game-guest-id", guestId);

    this.peer = new Peer(guestId);

    this.peer.on("open", () => {
      this.connection = this.peer.connect(hostId);

      this.connection.on("open", () => {
        if (!this.connection) {
          return;
        }

        this.connection.on("data", (data) => {
          this.events.emit(data);
        });
      });
    });
  }

  destroy() {
    this.peer.destroy();
  }

  get id() {
    return this.peer.id;
  }

  ping() {
    if (!this.connection) {
      return;
    }

    this.connection.send(
      eventSchema.parse({
        type: "ping",
      })
    );
  }
}
