import { writable } from 'svelte/store';
import type { GameRoom } from 'vite-env';

export function initGameRoomStore() {
  const base = writable<GameRoom>();

  return { ...base };
}
