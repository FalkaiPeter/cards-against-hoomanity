import { get, writable } from 'svelte/store';
import { uuid } from 'utils';

export function initPlayerStore() {
  const base = writable<{ uid: string; name: string }>({
    name: localStorage.getItem('name') || '',
    uid: sessionStorage.getItem('uid') || uuid(),
  });

  sessionStorage.setItem('uid', get(base).uid);

  const name = (name: string) => {
    base.update((state) => ({ ...state, name }));
    localStorage.setItem('name', name);
  };

  return { subscribe: base.subscribe, name };
}
