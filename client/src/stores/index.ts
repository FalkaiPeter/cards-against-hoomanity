import { initCardsStore } from './_cards';
import { initClockStore } from './_clock';
import { initGameRoomStore } from './_gameRoom';
import { initUserStore } from './_user';

export const cards = initCardsStore();
export const user = initUserStore();
export const gameRoom = initGameRoomStore();
export const clock = initClockStore();
