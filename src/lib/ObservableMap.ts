export class ObservableMap<Key, Value> extends Map<Key, Value> {
  public readonly setEvents: Set<(key: Key, value: Value) => void> = new Set();
  public readonly deleteEvents: Set<(key: Key) => void> = new Set();

  set(key: Key, value: Value): this {
    super.set(key, value);
    this.setEvents.forEach((listener) => listener(key, value));
    return this;
  }

  delete(key: Key): boolean {
    const result = super.delete(key);
    this.deleteEvents.forEach((listener) => listener(key));
    return result;
  }
}
