import z from "zod";
import { teamSchema } from "./Team";

export const teamSyncEvent = z.object({
  type: z.literal("teams"),
  teams: z.array(teamSchema),
});

export const pingEvent = z.object({
  type: z.literal("ping"),
});

export const hostEventSchema = z.union([teamSyncEvent, pingEvent]);
export type HostEvent = z.infer<typeof hostEventSchema>;

export const guestEventSchema = pingEvent;
export type GuestEvent = z.infer<typeof guestEventSchema>;

export const eventSchema = z.union([teamSyncEvent, pingEvent]);

export type Event = z.infer<typeof eventSchema>;

export type EventListener<T extends Event["type"] = Event["type"]> = (
  event: Extract<Event, { type: T }>
) => void;
