import { Express } from 'express-serve-static-core';
import { endBreak, startBreak } from './break-service';

export function setupBreakEndpoints(app: Express) {
  app.post('/breaks/start', startBreak);
  app.post('/breaks/end', endBreak);
}