import Peer, { DataConnection } from "peerjs";
import { v4 } from "uuid";

export class Guest {
  public peer: Peer;
  private connection: DataConnection | null = null;

  constructor(hostId: string) {
    const guestId =
      localStorage.getItem("sequence-game-guest-id") || `sequence-game-${v4()}`;
    localStorage.setItem("sequence-game-guest-id", guestId);

    this.peer = new Peer(guestId);

    this.peer.on("open", (id) => {
      console.log("Guest peer open", id);
      this.connection = this.peer.connect(hostId);

      this.connection.on("open", () => {
        console.log("Guest connection open");
        if (!this.connection) {
          return;
        }

        this.connection.send("Hello from guest");

        this.connection.on("data", (data) => {
          console.log("Guest connection data", data);
        });
      });

      this.connection.on("error", (error) => {
        console.log("Guest connection error", error);
      });
    });

    this.peer.on("error", (error) => {
      console.log("Guest peer error", error);
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

    this.connection.send("ping");
  }
}
