import { Clock } from 'types/_clock';

export class ClockManager {
  private __clocks: Record<string, Clock>;

  constructor() {
    this.__clocks = {};
  }

  create(id: string, cb: (counter: number) => void) {
    this.__clocks[id] = Clock({ id, cb });
    this.__clocks[id].interval = setInterval(() => {
      if (this.__clocks[id].counter <= 0) return;
      this.__clocks[id].counter -= 1;
      this.__clocks[id].cb(this.__clocks[id].counter);
    }, 1000);
  }

  setCb(id: string, cb: (counter: number) => void) {
    this.__clocks[id].cb = cb;
  }

  setCounter(id: string, counter: number) {
    this.__clocks[id].counter = counter;
  }
}
