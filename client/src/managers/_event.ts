import type { DefaultEventsMap } from '@socket.io/component-emitter';
import { io, Socket } from 'socket.io-client';
import { clock, gameRoom, player } from 'stores';
import { push, replace } from 'svelte-spa-router';
import { get } from 'svelte/store';
import type { GameRoom } from 'vite-env';

export class EventManager {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor() {
    this.socket = io('https://cards-against-hoomanity-server.herokuapp.com/');
    this.socket.on('connected', () => console.info('connected'));
  }

  createRoom(packs: number[]) {
    this.socket.once('server:gameroom:create', (roomID) => push(`/lobby/${roomID}`));
    this.socket.emit('client:gameroom:create', { packs, owner: get(player).uid });
  }

  joinRoom(roomID: string, onSuccess?: () => void) {
    this.socket.once('server:gameroom:join:success', onSuccess);
    this.socket.emit('client:gameroom:join', { roomID, ...get(player) });
  }

  gameStart() {
    this.socket.emit('client:gameroom:start', get(gameRoom).id);
  }

  playerPick(picks: number[], onSuccess?: () => void, onFailure?: () => void) {
    this.socket.once('server:gameroom:player:pick:success', onSuccess);
    this.socket.once('server:gameroom:player:pick:failure', onFailure);
    this.socket.emit('client:gameroom:player:pick', { roomID: get(gameRoom).id, uid: get(player).uid, picks });
  }

  czarPick(uid: string) {
    this.socket.emit('client:gameroom:czar:pick', { roomID: get(gameRoom).id, uid });
  }

  loadGameRoom(roomID: string) {
    this.socket.once('server:gameroom:load', (room: GameRoom) => gameRoom.set(room));
    this.socket.emit('client:gameroom:load', roomID);
  }

  listenGameStart() {
    this.socket.once('server:gameroom:start', () => replace(`/game/${get(gameRoom).id}`));
  }

  listenGameRoom() {
    this.socket.on('server:gameroom:update', (room: GameRoom) => gameRoom.set(room));
  }

  offGameRoom() {
    this.socket.off('server:gameroom:update');
  }

  listenClock() {
    this.socket.on('server:clock:tick', (counter) => clock.set(counter));
  }

  offClock() {
    this.socket.off('server:clock:tick');
  }
}
