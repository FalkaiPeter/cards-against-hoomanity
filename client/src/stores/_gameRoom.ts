import { writable } from 'svelte/store';
import type { GameRoom } from 'vite-env';

const initialState: GameRoom = {
  id: '',
  czar: '',
  owner: '',
  black: -1,
  packs: [],
  state: 'lobby',
  players: {},
};

export function initGameRoomStore() {
  const base = writable<GameRoom>(initialState);

  const reset = () => base.set(initialState);
  return { ...base, reset };
}
