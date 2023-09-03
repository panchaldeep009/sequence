import Peer, { DataConnection } from "peerjs";
import { v4 } from "uuid";
import { User } from "./User";
import { Team } from "./Team";

export class Host {
  private peer: Peer;
  private connections: Map<string, DataConnection> = new Map();
  private users: Map<string, User> = new Map();

  constructor(public teams: Team[]) {
    const hostId =
      localStorage.getItem("sequence-game-host-id") || `sequence-game-${v4()}`;
    localStorage.setItem("sequence-game-host-id", hostId);

    this.peer = new Peer(hostId);

    this.peer.on("open", (id) => {
      console.log("Host peer open", id);
    });

    this.peer.on("connection", (connection) => {
      console.log("Host connection received", connection);

      connection.on("open", () => {
        this.connections.set(connection.connectionId, connection);
        connection.send("Hello from host");

        connection.send({
          type: "teams",
          teams,
        });

        connection.on("data", (data) => {
          console.log("Host connection data", data);
        });
      });
    });

    this.peer.on("disconnected", () => {
      console.log("Host peer disconnected");
    });

    this.peer.on("error", (error) => {
      console.log("Host peer error", error);
    });
  }

  destroy() {
    this.peer.destroy();
  }

  get id() {
    return this.peer.id;
  }

  ping() {
    this.connections.forEach((connection) => {
      connection.send("ping");
    });
  }
}
