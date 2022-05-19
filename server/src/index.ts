import { EventManager } from 'managers';
import express from 'express';

const app = express();
const server = app.listen(process.env.PORT);
new EventManager(server);
