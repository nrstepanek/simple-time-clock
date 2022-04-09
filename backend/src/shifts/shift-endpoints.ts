import { Express } from 'express-serve-static-core';
import { endShift, startShift } from './shift-service';

export function setupShiftEndpoints(app: Express) {
  app.post('/shifts/start', startShift);
  app.post('/shifts/end', endShift);
}