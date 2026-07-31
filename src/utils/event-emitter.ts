type Listener = (...args: unknown[]) => void;

class EventEmitter {
  private listeners: Record<string, Listener[]> = {};

  on(event: string, listener: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event: string, listener: Listener) {
    const list = this.listeners[event];
    if (list) {
      this.listeners[event] = list.filter((l) => l !== listener);
    }
  }

  emit(event: string, ...args: unknown[]) {
    const list = this.listeners[event];
    if (list) {
      list.forEach((listener) => listener(...args));
    }
  }

  removeAll(event?: string) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}

export const eventEmitter = new EventEmitter();
