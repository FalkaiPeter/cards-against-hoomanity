import type { DefaultEventsMap } from '@socket.io/component-emitter';
import { io, Socket } from 'socket.io-client';

class EventManager {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor() {
    this.socket = io('ws://localhost:4000');
    this.socket.on('connected', () => console.info('connected'));
  }

  createRoom(packs: number[], owner: string) {
    this.socket.once('server:gameroom:create', console.log);
    this.socket.emit('client:gameroom:create', { packs, owner });
  }
}

export default new EventManager();
