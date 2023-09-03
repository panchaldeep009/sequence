import z from "zod";
import { teamSchema } from "./Team";
import { DataConnection } from "peerjs";

export const teamSyncEvent = z.object({
  type: z.literal("teams"),
  teams: z.array(teamSchema),
});

export const pingEvent = z.object({
  type: z.literal("ping"),
});

export const eventSchema = z.union([teamSyncEvent, pingEvent]);

export type Event = z.infer<typeof eventSchema>;

export type EventListener<T extends Event["type"] = Event["type"]> = (
  event: Extract<Event, { type: T }>
) => void;

export class ConnectionEventManager {
  private eventListener: Map<string, Set<Function>> = new Map();
  public readonly connection: DataConnection;

  constructor(connection: DataConnection) {
    this.connection = connection;

    this.connection.on("open", () => {
      this.connection.on("data", (data) => {
        const event = eventSchema.parse(data);

        this.eventListener.get(event.type)?.forEach((listener) => {
          listener(event);
        });
      });
    });
  }

  on<T extends Event["type"]>(type: T, listener: EventListener<T>) {
    if (!this.eventListener.has(type)) {
      this.eventListener.set(type, new Set());
    }

    this.eventListener.get(type)?.add(listener);

    return () => {
      this.eventListener.get(type)?.delete(listener);
    };
  }

  send(event: Event) {
    this.connection.send(event);
  }
}
