import { initCardsStore } from './_cards';
import { initClockStore } from './_clock';
import { initGameRoomStore } from './_gameRoom';
import { initPlayerStore } from './_player';

export const cards = initCardsStore();
export const player = initPlayerStore();
export const gameRoom = initGameRoomStore();
export const clock = initClockStore();
