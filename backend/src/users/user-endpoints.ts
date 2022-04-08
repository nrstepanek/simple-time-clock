import { Express } from 'express-serve-static-core';
import { validate, login, logout, createUser } from './user-service';

export function setupUserEndpoints(app: Express) {
	app.post('/register', validate('createUser'), createUser);
	app.post('/login', validate('login'), login);
	app.get('/logout', validate('logout'), logout);
}