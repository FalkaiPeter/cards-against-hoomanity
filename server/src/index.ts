import { createServer } from 'http';
import { EventManager } from 'managers';

const httpServer = createServer();
new EventManager(httpServer);

httpServer.listen(process.env.PORT);
