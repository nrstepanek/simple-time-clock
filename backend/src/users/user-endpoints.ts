import { Express } from 'express-serve-static-core';
import { validate, login, logout, createUser, checkAuthentication, getUserData, getAllUserData } from './user-service';

export function setupUserEndpoints(app: Express) {
  app.get('/users', getUserData);
  app.get('/users/details', getAllUserData);
  app.post('/checkAuthentication', checkAuthentication);
	app.post('/register', validate('createUser'), createUser);
	app.post('/login', validate('login'), login);
	app.get('/logout', validate('logout'), logout);
}