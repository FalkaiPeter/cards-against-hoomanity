import type { DefaultEventsMap } from '@socket.io/component-emitter';
import { io, Socket } from 'socket.io-client';
import { clock, gameRoom, player } from 'stores';
import { push, replace } from 'svelte-spa-router';
import { get } from 'svelte/store';
import type { GameRoom } from 'vite-env';

export class EventManager {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor() {
    this.socket = io('ws://localhost:4000');
    this.socket.on('connected', () => console.info('connected'));
  }

  createRoom(packs: number[]) {
    this.socket.once('server:gameroom:create', (roomID) => push(`/lobby/${roomID}`));
    this.socket.emit('client:gameroom:create', { packs, owner: get(player).uid });
  }

  joinRoom(roomID: string) {
    this.socket.once('server:gameroom:join:success', () => push(`/lobby/${roomID}`));
    this.socket.emit('client:gameroom:join', { roomID, ...get(player) });
  }

  rejoinRoom(roomID: string) {
    this.socket.once('server:gameroom:rejoin:success', () => console.info('successful rejoin'));
    this.socket.once('server.gameroom:rejoin:failure', () => console.info('rejoin failed'));
    this.socket.emit('client:gameroom:rejoin', { roomID, uid: get(player).uid });
  }

  gameStart() {
    this.socket.once('server:gameroom:start', () => replace(`/game/${get(gameRoom).id}`));
    this.socket.emit('client:gameroom:start', get(gameRoom).id);
  }

  playerPick(picks: number[]) {
    this.socket.once('server:gameroom:player:pick:success', () => console.info('successful pick'));
    this.socket.once('server:gameroom:player:pick:failure', () => console.info('pick failed'));
    this.socket.emit('client:gameroom:player:pick', { roomID: get(gameRoom).id, uid: get(player).uid, picks });
  }

  czarPick(uid: string) {
    this.socket.emit('client:gameroom:czar:pick', { roomID: get(gameRoom).id, uid });
  }

  listenRoom() {
    this.socket.on('server:gameroom:update', (room: GameRoom) => gameRoom.set(room));
  }

  listenClock() {
    this.socket.on('server:clock:tick', (counter) => clock.set(counter));
  }
}
