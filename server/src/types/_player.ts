import { uuid } from 'utils';

export interface Player {
  id: string;
  name: string;
  points: number;
  cards: number[];
  picks: number[];
}

export const Player = (fields?: Partial<Player>): Player => ({
  id: uuid(),
  name: '',
  points: 0,
  cards: [],
  picks: [],
  ...fields,
});
