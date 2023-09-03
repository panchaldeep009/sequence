import Peer, { DataConnection } from "peerjs";
import { create } from "zustand";
import { Team } from "../Team";
import { HostEvent, guestEventSchema, hostEventSchema } from "../Events";
import { v4 } from "uuid";

interface HostStoreState {
  readonly teams: Team[];
  readonly host: Peer | null;
  readonly connections: DataConnection[];
  readonly id: string | null;
}

interface HostStoreActions {
  createHost: (teams: Team[]) => void;
  destroyHost: () => void;
  send: (event: HostEvent) => void;
  sendTo: (event: HostEvent, connection: DataConnection) => void;
  setTeams: (teams: Team[]) => void;
}

export const useHostStore = create<HostStoreState & HostStoreActions>(
  (set, get) => {
    return {
      host: null,
      teams: [],
      connections: [],
      createHost: (teams: Team[]) => {
        if (teams.length < 2) {
          throw new Error("Must have at least 2 teams to create a host");
        }

        const hostId =
          localStorage.getItem("sequence-game-host-id") ||
          `sequence-game-${v4()}`;

        localStorage.setItem("sequence-game-host-id", hostId);

        const peer = new Peer(hostId);

        set({ host: peer, teams });

        peer.on("open", () => {
          peer.on("connection", (connection) => {
            connection.on("open", () => {
              get().connections.push(connection);
              connection.on("data", (data) => {
                const guestEvent = guestEventSchema.parse(data);
                if (guestEvent.type === "ping") {
                  console.log("ping");
                  return;
                }
              });
              get().sendTo(
                {
                  type: "teams",
                  teams: get().teams,
                },
                connection
              );
            });
          });
        });
      },

      destroyHost: () => {
        get().host?.destroy();
        set({ host: null });
      },

      send: (event) => {
        const eventData = hostEventSchema.parse(event);
        get().connections.forEach((connection) => {
          connection.send(eventData);
        });
      },

      sendTo: (event, connection) => {
        const eventData = hostEventSchema.parse(event);
        connection.send(eventData);
      },

      get id() {
        return get().host?.id || null;
      },

      setTeams: (teams: Team[]) => {
        get().send({
          type: "teams",
          teams,
        });

        set({ teams });
      },
    };
  }
);
