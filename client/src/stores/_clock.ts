import { writable } from 'svelte/store';

export function initClockStore() {
  const base = writable<number>(-1);

  return { ...base };
}
