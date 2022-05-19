import { uuid } from 'utils';

export interface Clock {
  id: string;
  counter: number;
  cb: (counter: number) => void;
  interval: NodeJS.Timer;
}

export const Clock = (fields?: Partial<Clock>): Clock => ({
  id: uuid(),
  cb: () => {},
  counter: 60,
  interval: setInterval(() => {}, Infinity),
  ...fields,
});
