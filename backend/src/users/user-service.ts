import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body } from 'express-validator/check';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const bcryptWorkFactor = 10;

export function validate(type: string) {
	switch (type) {
		case 'createUser': {
			return [
				body('username', 'username doesn\'t exist').exists(),
				body('password', 'password doesn\'t exist').exists()
			]
		}
		case 'login': {
			return [
				body('username', 'username doesn\'t exist').exists(),
				body('password', 'password doesn\'t exist').exists()
			]
		}
	}	

	return [];
}

export async function createUser(req: Request, res: Response) {
	bcrypt.genSalt(bcryptWorkFactor, (_err1: any, salt: string) => {
		bcrypt.hash(req.body.password, salt, async (_err2: any, hash: string) => {
			req.body.password = hash;
			const result = await prisma.users.create({
				data: req.body
			});
			res.status(200);
			res.end();
		});
	});
}

export async function login(req: Request, res: Response) {
	if (req.session.authenticated) {
		res.status(200);
		res.send('already_authenticated');
		return;
	}

	const { sentUsername, sentPassword } = req.body;
	const user = await prisma.users.findFirst({
		where: { username: req.body.username }
	});

	if (!user) {
		res.status(200);
		res.send('unknown_user');
		return;
	}

	bcrypt.compare(sentPassword, user.password, (err, result) => {
		if (result) {
			req.session.userid = user.id;
			req.session.username = sentUsername;
			req.session.authenticated = true;
			res.status(200);
			res.cookie('username', sentUsername);
			res.cookie('userid', user.id);
			res.send("success");
			return;
		} else {
			res.status(200);
			res.send('invalid_password.');
			return;
		}
	});
}

export async function logout(req: Request, res: Response) {
	req.session.destroy(() => {
		res.status(200);
		res.end();
	});
}