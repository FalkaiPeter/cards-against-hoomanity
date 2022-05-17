import { Player } from 'types';
import { uuid } from 'utils';

export interface GameRoom {
  id: string;
  czar: string;
  owner: string;
  black: number;
  packs: number[];
  state: 'running' | 'lobby';
  graveyardWhite: number[];
  graveyardBlack: number[];
  players: Record<string, Player>;
}

export const GameRoom = (fields?: Partial<GameRoom>): GameRoom => ({
  id: uuid(),
  black: -1,
  czar: '',
  owner: '',
  packs: [],
  players: {},
  state: 'lobby',
  graveyardBlack: [],
  graveyardWhite: [],
  ...fields,
});
