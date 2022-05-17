import { writable } from 'svelte/store';

export function initClockStore() {
  const base = writable<number>();

  return { ...base };
}
