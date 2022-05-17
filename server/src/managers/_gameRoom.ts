import { GameRoom, Player } from 'types';
import omit from 'lodash/omit';
import sample from 'lodash/sample';
import sampleSize from 'lodash/sampleSize';
import values from 'lodash/values';
import difference from 'lodash/difference';
import cards from 'cards.json';

export class GameRoomManager {
  private __gameRooms: Record<string, GameRoom>;

  constructor() {
    this.__gameRooms = {};
  }

  create({ packs, owner }) {
    const room = GameRoom({ packs, owner });
    this.__gameRooms[room.id] = room;
    console.log('gameRoom created with id:', room.id);
    return room;
  }

  join({ roomID, name, uid }) {
    const player = Player({ name, id: uid });
    this.__gameRooms[roomID].players[uid] = player;
    console.log('player with uid:', uid, 'joined to room', roomID);
    return uid;
  }

  start(roomID: string) {
    this.__gameRooms[roomID].state = 'running';
    console.log('gameroom with id', roomID, 'started');
  }

  dealHand(roomID: string) {
    const { players, packs, graveyardWhite } = this.__gameRooms[roomID];
    let pool = sampleSize(
      packs.flatMap((pack) => cards.packs[pack].white).filter((white) => !graveyardWhite.includes(white)), // pickable whites
      values(players).reduce((prev, curr) => (prev += 10 - curr.cards.length), 0) // missing car count
    );

    this.__gameRooms[roomID].graveyardWhite.push(...pool);
    for (const key in players) {
      const picks = sampleSize(pool, 10 - players[key].cards.length);
      pool = pool.filter((card) => !picks.includes(card));
      this.__gameRooms[roomID].players[key].cards.push(...picks);
    }
  }

  dealBlack(roomID: string) {
    const { black, packs, graveyardBlack } = this.__gameRooms[roomID];
    if (black > -1) this.__gameRooms[roomID].graveyardBlack.push(black);
    this.__gameRooms[roomID].black = sample(
      packs.flatMap((pack) => cards.packs[pack].black).filter((black) => !graveyardBlack.includes(black))
    );
  }

  playerPick({ roomID, uid, picks }) {
    if (picks.length !== cards.black[this.__gameRooms[roomID].black].pick) return false;
    this.__gameRooms[roomID].players[uid].picks = picks;
    this.__gameRooms[roomID].graveyardWhite.push(...picks);
    this.__gameRooms[roomID].players[uid].cards = difference(this.__gameRooms[roomID].players[uid].cards, picks);
    return true;
  }

  isAllPlayerPicked(roomID: string) {
    const { black, players } = this.__gameRooms[roomID];
    const { pick } = cards.black[black];
    return values(players).every((player) => player.picks.length === pick);
  }

  givePoint({ roomID, uid }) {
    this.__gameRooms[roomID].players[uid].points += 1;
  }

  changeCzar({ roomID, uid }) {
    this.__gameRooms[roomID].czar = uid;
  }

  gameRoom(roomID: string) {
    return this.__gameRooms[roomID];
  }

  gameRoomClient(roomID: string) {
    return omit(this.__gameRooms[roomID], ['graveyardBlack', 'graveyardWhite']);
  }
}
