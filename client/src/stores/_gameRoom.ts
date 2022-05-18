import { writable } from 'svelte/store';
import type { GameRoom } from 'vite-env';

export function initGameRoomStore() {
  const base = writable<GameRoom>({
    id: '',
    czar: '',
    owner: '',
    black: -1,
    packs: [],
    state: 'lobby',
    players: {},
  });

  return { ...base };
}
