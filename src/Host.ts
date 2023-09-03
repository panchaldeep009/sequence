import Peer, { DataConnection } from "peerjs";
import { v4 } from "uuid";
import { User } from "./User";
import { Team } from "./Team";
import { ObservableMap } from "./lib/ObservableMap";
import { eventSchema } from "./EventManager";

export class Host {
  private peer: Peer;
  private connections: ObservableMap<string, DataConnection> =
    new ObservableMap();

  private users: Map<string, User> = new Map();

  constructor(public teams: Team[]) {
    const hostId =
      localStorage.getItem("sequence-game-host-id") || `sequence-game-${v4()}`;
    localStorage.setItem("sequence-game-host-id", hostId);

    this.connections.setEvents.add((_connectionId, connection) => {
      connection.send({
        type: "teams",
        teams,
      });

      connection.on("data", (data) => {
        const events = eventSchema.parse(data);

        if (events.type === "ping") {
          console.log("ping");
          return;
        }
      });
    });

    this.peer = new Peer(hostId);

    this.peer.on("open", () => {
      this.peer.on("connection", (connection) => {
        connection.on("open", () => {
          this.connections.set(connection.connectionId, connection);
        });

        connection.on("close", () => {
          this.connections.delete(connection.connectionId);
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
    this.connections.forEach((connection) => {
      connection.send(
        eventSchema.parse({
          type: "ping",
        })
      );
    });
  }
}
