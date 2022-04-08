import express from 'express'
import cors from 'cors';
import sessions from 'express-session';
import cookieParser from 'cookie-parser';
import { setupUserEndpoints } from './users/user-endpoints';
import { setupShiftEndpoints } from './shifts/shift-endpoints';
import { setupBreakEndpoints } from './breaks/break-endpoints';

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions({
	secret: "timeclocksecret",
	saveUninitialized: false,
	cookie: { secure: false },
	resave: false
}));
app.use(cookieParser());

var corsOptions = {
  origin: 'http://localhost:8081',
  credentials: true
}
app.use(cors(corsOptions));

declare module 'express-session' {
	interface SessionData {
		userid: number;
		username: string;
		authenticated: boolean;
    admin: boolean;
	}
}

const publicApis = ['/login', '/register', '/checkAuthentication'];
const adminApis = [];

app.use((req, res, next) => {
	if (req.session.authenticated || publicApis.includes(req.originalUrl)) {
		next();
	} else {
		res.status(401);
		res.send('Not authenticated, please login first');
	}
})

const port = process.env.PORT || 5001;

setupUserEndpoints(app);
setupShiftEndpoints(app);
setupBreakEndpoints(app);

app.listen(port, () => console.log(`Running on port ${port}`))