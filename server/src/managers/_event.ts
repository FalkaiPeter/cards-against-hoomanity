import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { log } from 'utils';
import { ClockManager, GameRoomManager } from 'managers';
import reduce from 'lodash/reduce';

export class EventManager {
  private __io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  private __gameRoomManager: GameRoomManager;
  private __clockManager: ClockManager;

  constructor() {
    this.__io = new Server(+process.env.PORT!, { cors: { origin: '*' } });
    this.__gameRoomManager = new GameRoomManager();
    this.__clockManager = new ClockManager();

    this.__io.on('connection', (socket) => {
      log('connection', { Socket: socket.id });
      socket.emit('connected', socket.id);

      socket.on('client:gameroom:create', ({ packs, owner }) => {
        const gameRoom = this.__gameRoomManager.create({ packs, owner });

        socket.emit('server:gameroom:create', gameRoom.id);

        log('gameroom created', {
          Socket: socket.id,
          GameRoom: gameRoom,
        });
      });

      socket.on('client:gameroom:join', ({ roomID, name, uid }) => {
        const { players } = this.__gameRoomManager.gameRoom(roomID);
        if (!(uid in players)) this.__gameRoomManager.join({ roomID, name, uid });

        socket.join(roomID);
        socket.emit('server:gameroom:join:success');
        this.__io.to(roomID).emit('server:gameroom:update', this.__gameRoomManager.gameRoomClient(roomID));

        log('player join to gameroom', {
          Socket: socket.id,
          'Player UID': uid,
          GameRoom: this.__gameRoomManager.gameRoom(roomID),
        });
      });

      socket.on('client:gameroom:start', (roomID) => {
        this.__gameRoomManager.start(roomID);
        this.__gameRoomManager.dealBlack(roomID);
        this.__gameRoomManager.dealHand(roomID);
        this.__gameRoomManager.changeCzar({ roomID, uid: this.__gameRoomManager.gameRoom(roomID).owner });
        this.__clockManager.create(roomID, (counter) => {
          if (counter === 0 && !this.__gameRoomManager.anyPlayerPicked(roomID))
            this.__clockManager.setCounter(roomID, 60);
          this.__io.to(roomID).emit('server:clock:tick', counter);
        });

        this.__io.to(roomID).emit('server:gameroom:start');
        this.__io.to(roomID).emit('server:gameroom:update', this.__gameRoomManager.gameRoomClient(roomID));

        log('game start', {
          Socket: socket.id,
          'GameRoom:': this.__gameRoomManager.gameRoom(roomID),
        });
      });

      socket.on('client:gameroom:player:pick', ({ roomID, uid, picks }) => {
        const res = this.__gameRoomManager.playerPick({ roomID, uid, picks });
        if (this.__gameRoomManager.isAllPlayerPicked(roomID)) this.__clockManager.setCounter(roomID, -1);

        if (res) socket.emit('server:gameroom:player:pick:success');
        else socket.emit('server:gameroom:player:pick:failure');
        this.__io.to(roomID).emit('server:gameroom:update', this.__gameRoomManager.gameRoomClient(roomID));

        log('player pick', {
          Socket: socket.id,
          'Player UID': uid,
          Picks: picks,
          GameRoom: this.__gameRoomManager.gameRoom(roomID),
        });
      });

      socket.on('client:gameroom:load', (roomID) => {
        socket.emit('server:gameroom:load', this.__gameRoomManager.gameRoomClient(roomID));

        log('game load', {
          Socket: socket.id,
          'GameRoom:': this.__gameRoomManager.gameRoom(roomID),
        });
      });

      socket.on('client:gameroom:czar:pick', ({ roomID, uid }) => {
        this.__gameRoomManager.givePoint({ roomID, uid });
        this.__gameRoomManager.changeCzar({ roomID, uid });
        this.__gameRoomManager.clearPlayerPicks(roomID);
        this.__gameRoomManager.dealBlack(roomID);
        this.__gameRoomManager.dealHand(roomID);
        this.__clockManager.setCounter(roomID, 60);

        this.__io.to(roomID).emit('server:gameroom:update', this.__gameRoomManager.gameRoom(roomID));

        log('czar pick', {
          Socket: socket.id,
          'GameRoom:': this.__gameRoomManager.gameRoom(roomID),
        });
      });
    });
  }
}
