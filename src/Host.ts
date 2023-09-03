import Peer, { DataConnection } from "peerjs";
import { v4 } from "uuid";
import { Team } from "./Team";
import { ConnectionEventManager } from "./ConnectionEventManager";

export class Host {
  private peer: Peer;
  private connections: Map<string, DataConnection> = new Map();
  private events = new ConnectionEventManager();

  constructor(public teams: Team[]) {
    const hostId =
      localStorage.getItem("sequence-game-host-id") || `sequence-game-${v4()}`;
    localStorage.setItem("sequence-game-host-id", hostId);

    this.peer = new Peer(hostId);

    this.peer.on("open", () => {
      this.peer.on("connection", (connection) => {
        connection.on("open", () => {
          this.connections.set(connection.connectionId, connection);
          this.events.setConnection(connection);
          this.events.sendTo(
            {
              type: "teams",
              teams: this.teams,
            },
            connection
          );
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
    this.events.send({
      type: "ping",
    });
  }
}
