import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { GameRoomManager } from './_gameRoom';

export class EventManager {
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  private gameRoomManager: GameRoomManager;

  constructor() {
    this.io = new Server(4000, { cors: { origin: '*' } });
    this.gameRoomManager = new GameRoomManager();

    this.io.on('connection', (socket) => {
      console.log(socket.id, 'connected');
      socket.emit('connected', socket.id);

      socket.on('client:gameroom:create', ({ packs, owner }) => {
        const { id } = this.gameRoomManager.create({ packs, owner });
        socket.emit('server:gameroom:create', id);
      });

      socket.on('client:gameroom:join', ({ roomID, name }) => {
        const uid = this.gameRoomManager.join({ roomID, name });
        socket.emit('server:gameroom:join', uid);
        this.io.to(roomID).emit('server:gameroom:update', this.gameRoomManager.gameRoomClient(roomID));
        socket.join(roomID);
      });

      socket.on('client:gameroom:rejoin', ({ roomID, uid }) => {
        const gameRoom = this.gameRoomManager.gameRoom(roomID);
        if (uid in gameRoom.players) {
          socket.join(roomID);
          socket.emit('server:gameroom:rejoin:success', gameRoom);
        } else socket.emit('server.gameroom:rejoin:failure');
      });

      socket.on('client:gameroom:start', (roomID) => {
        this.gameRoomManager.start(roomID);
        this.gameRoomManager.dealBlack(roomID);
        this.gameRoomManager.dealHand(roomID);
        this.gameRoomManager.changeCzar({ roomID, uid: this.gameRoomManager.gameRoom(roomID).owner });
        //start ticker
        this.io.to(roomID).emit('server:gameroom:start');
        this.io.to(roomID).emit('server:gameroom:update', this.gameRoomManager.gameRoomClient(roomID));
      });

      socket.on('client:gameroom:player:pick', ({ roomID, uid, picks }) => {
        const res = this.gameRoomManager.playerPick({ roomID, uid, picks });

        //ticker stop
        if (res) {
          this.io.to(roomID).emit('server:gameroom:update', this.gameRoomManager.gameRoom(roomID));
          socket.emit('server:gameroom:player:pick:success');
        } else socket.emit('server:gameroom:player:pick:failure', this.gameRoomManager.gameRoomClient(roomID));
      });
      socket.on('client:gameroom:czar:pick', ({ roomID, uid }) => {
        this.gameRoomManager.givePoint({ roomID, uid });
        this.gameRoomManager.changeCzar({ roomID, uid });
        this.gameRoomManager.dealBlack(roomID);
        this.gameRoomManager.dealHand(roomID);
        //ticker reset
        this.io.to(roomID).emit('server:gameroom:update', this.gameRoomManager.gameRoom(roomID));
      });
    });
  }
}
