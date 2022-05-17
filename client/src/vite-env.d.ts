/// <reference types="svelte" />
/// <reference types="vite/client" />

type BlackCard = { text: string; pick: number };
type Pack = { name: string; black: number[]; white: number[]; offical: boolean };
interface Cards {
  black: BlackCard[];
  white: string[];
  packs: Pack[];
}

interface GameRoom {
  id: string;
  czar: string;
  owner: string;
  black: number;
  packs: number[];
  state: 'running' | 'lobby';
  players: Record<string, Player>;
}

export interface Player {
  id: string;
  name: string;
  points: number;
  cards: number[];
  picks: number[];
}
