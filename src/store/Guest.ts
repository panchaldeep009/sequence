import Peer, { DataConnection } from "peerjs";
import { create } from "zustand";
import { Team } from "../Team";
import { GuestEvent, guestEventSchema, hostEventSchema } from "../Events";
import { v4 } from "uuid";

interface GuestStoreState {
  readonly teams: Team[];
  readonly connection: DataConnection | null;
  readonly roomId: string | null;
  readonly guest: Peer | null;
}

interface GuestStoreActions {
  createGuest: (roomId: string) => void;
  destroyGuest: () => void;
  send: (event: GuestEvent) => void;
}

export const useGuestStore = create<GuestStoreState & GuestStoreActions>(
  (set, get) => ({
    guest: null,
    roomId: null,
    connection: null,
    teams: [],
    createGuest: (roomId) => {
      const guestId =
        localStorage.getItem("sequence-game-guest-id") ||
        `sequence-game-${v4()}`;
      localStorage.setItem("sequence-game-guest-id", guestId);

      const guest = new Peer(guestId);

      guest.on("open", () => {
        const connection = guest.connect(roomId);
        connection.on("open", () => {
          set({ connection });
          connection.on("data", (data) => {
            const hostEvent = hostEventSchema.parse(data);
            if (hostEvent.type === "ping") {
              console.log("ping");
              return;
            }

            if (hostEvent.type === "teams") {
              set({ teams: hostEvent.teams });
            }
          });
        });
      });

      set({ guest, roomId });
    },

    destroyGuest: () => {
      get().guest?.destroy();
      set({ guest: null, roomId: null, connection: null });
    },

    send: (event) => {
      const eventData = guestEventSchema.parse(event);
      get().connection?.send(eventData);
    },
  })
);
