import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ClockManager } from './_clock';
import { GameRoomManager } from './_gameRoom';

export class EventManager {
  private __io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  private __gameRoomManager: GameRoomManager;
  private __clockManager: ClockManager;

  constructor() {
    this.__io = new Server(4000, { cors: { origin: '*' } });
    this.__gameRoomManager = new GameRoomManager();
    this.__clockManager = new ClockManager();

    this.__io.on('connection', (socket) => {
      console.log(socket.id, 'connected');
      socket.emit('connected', socket.id);

      socket.on('client:gameroom:create', ({ packs, owner }) => {
        const { id } = this.__gameRoomManager.create({ packs, owner });
        socket.emit('server:gameroom:create', id);
      });

      socket.on('client:gameroom:join', ({ roomID, name, uid }) => {
        this.__gameRoomManager.join({ roomID, name, uid });
        socket.emit('server:gameroom:join:success');
        this.__io.to(roomID).emit('server:gameroom:update', this.__gameRoomManager.gameRoomClient(roomID));
        socket.join(roomID);
      });

      socket.on('client:gameroom:rejoin', ({ roomID, uid }) => {
        const gameRoom = this.__gameRoomManager.gameRoom(roomID);
        if (uid in gameRoom.players) {
          socket.join(roomID);
          socket.emit('server:gameroom:rejoin:success');
        } else socket.emit('server.gameroom:rejoin:failure');
      });

      socket.on('client:gameroom:start', (roomID) => {
        this.__gameRoomManager.start(roomID);
        this.__gameRoomManager.dealBlack(roomID);
        this.__gameRoomManager.dealHand(roomID);
        this.__gameRoomManager.changeCzar({ roomID, uid: this.__gameRoomManager.gameRoom(roomID).owner });
        this.__clockManager.create(roomID, (counter) => this.__io.to(roomID).emit('server:clock:tick', counter));

        this.__io.to(roomID).emit('server:gameroom:start');
        this.__io.to(roomID).emit('server:gameroom:update', this.__gameRoomManager.gameRoomClient(roomID));
      });

      socket.on('client:gameroom:player:pick', ({ roomID, uid, picks }) => {
        const res = this.__gameRoomManager.playerPick({ roomID, uid, picks });

        if (this.__gameRoomManager.isAllPlayerPicked(roomID)) this.__clockManager.setCounter(roomID, -1);

        if (res) socket.emit('server:gameroom:player:pick:success');
        else socket.emit('server:gameroom:player:pick:failure');

        this.__io.to(roomID).emit('server:gameroom:update', this.__gameRoomManager.gameRoom(roomID));
      });

      socket.on('client:gameroom:czar:pick', ({ roomID, uid }) => {
        this.__gameRoomManager.givePoint({ roomID, uid });
        this.__gameRoomManager.changeCzar({ roomID, uid });
        this.__gameRoomManager.dealBlack(roomID);
        this.__gameRoomManager.dealHand(roomID);
        this.__clockManager.setCounter(roomID, 60);
        this.__io.to(roomID).emit('server:gameroom:update', this.__gameRoomManager.gameRoom(roomID));
      });
    });
  }
}
