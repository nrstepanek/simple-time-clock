import { Express } from 'express-serve-static-core';
import { validate, login, logout, createUser, checkAuthentication, getUserData, getUserDetails, getAllUserDetails, getUsernames } from './user-service';

export function setupUserEndpoints(app: Express) {
  app.get('/users/usernames', getUsernames);
  app.get('/users/details', getAllUserDetails);
  app.get('/users/:id', getUserData);
  app.get('/users/:id/details', getUserDetails);
  app.post('/checkAuthentication', checkAuthentication);
	app.post('/users', validate('createUser'), createUser);
	app.post('/login', validate('login'), login);
	app.get('/logout', validate('logout'), logout);
}