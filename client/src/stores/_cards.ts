import axios from 'axios';
import { writable } from 'svelte/store';
import type { Cards } from 'vite-env';

const URL = 'https://raw.githubusercontent.com/crhallberg/json-against-humanity/latest/cah-all-compact.json';

export function initCardsStore() {
  const base = writable<Cards>();

  const load = async () => {
    const local = JSON.parse(localStorage.getItem('cards'));
    if (local) return base.set(local);
    const res = await axios.get(URL);
    localStorage.setItem('cards', JSON.stringify(res.data));
    return base.set(res.data);
  };

  return { subscribe: base.subscribe, load };
}
