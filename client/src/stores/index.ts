import { initCardsStore } from './_cards';
import { initGameRoomStore } from './_gameRoom';
import { initUserStore } from './_user';

export const cards = initCardsStore();
export const user = initUserStore();
export const gameRoom = initGameRoomStore();
