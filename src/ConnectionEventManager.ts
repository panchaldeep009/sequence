import { DataConnection } from "peerjs";
import { EventListener, Event, eventSchema } from "./Events";

export class ConnectionEventManager {
  private eventListener: Map<string, Set<Function>> = new Map();
  private connections: Set<DataConnection> = new Set();

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
    this.connections.forEach((connection) => {
      connection.send(event);
    });
  }

  sendTo(event: Event, connection: DataConnection) {
    connection.send(event);
  }

  destroy() {
    this.connections.forEach((connection) => {
      connection.close();
    });
  }

  setConnection(connection: DataConnection) {
    this.connections.add(connection);
    connection.on("data", (data) => {
      const event = eventSchema.parse(data);
      this.eventListener.get(event.type)?.forEach((listener) => {
        listener(event);
      });
    });
  }
}
