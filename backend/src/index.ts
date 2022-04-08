import express from 'express'
import cors from 'cors';
import sessions from 'express-session';
import sqlite3 from 'sqlite3';
import cookieParser from 'cookie-parser';
import { setupUserEndpoints } from './users/user-endpoints';

const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions({
	secret: "timeclocksecret",
	saveUninitialized: false,
	cookie: { secure: false },
	resave: false
}));
app.use(cookieParser());

declare module 'express-session' {
	interface SessionData {
		userid: number;
		username: string;
		authenticated: boolean;
	}
}

const publicApis = ['/login', '/register'];

app.use((req, res, next) => {
	if (req.session.authenticated || publicApis.includes(req.originalUrl)) {
		next();
	} else {
		res.status(401);
		res.send('Not authenticated, please login first');
	}
})

const port = process.env.PORT || 5001;

app.get('/', (_, res) => {
  res.status(200).send();
})

setupUserEndpoints(app);

app.listen(port, () => console.log(`Running on port ${port}`))