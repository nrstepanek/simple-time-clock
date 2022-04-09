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
        body('password', 'password doesn\'t exist').exists(),
        body('admin', 'admin doesn\'t exist').exists()
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

export async function getUserData(req: Request, res: Response) {
  if (req.session.userid == parseInt(req.params.id) || req.session.admin) {
    const userData = await prisma.users.findUnique({
      where: {
        id: parseInt(req.params.id)
      },
      select: {
        id: true,
        username: true,
        admin: true
      }
    });

    if (userData) {
      res.json(userData);
    }
  }

  res.status(401);
  res.end();
}

export async function getUserDetails(req: Request, res: Response) {
  if (req.session.userid == parseInt(req.params.id) || req.session.admin) {
    const userData = await prisma.users.findUnique({
      where: {
        id: parseInt(req.params.id)
      },
      select: {
        id: true,
        username: true,
        admin: true,
        shifts: {
          select: {
            id: true,
            start: true,
            end: true,
            breaks: {
              select: {
                id: true,
                start: true,
                end: true,
                lunch: true
              }
            }
          }
        }
      }
    });
    if (userData) {
      res.json(userData);
    }
  }

  res.status(401);
  res.end();
}

export async function getAllUserDetails(req: Request, res: Response) {
  if (req.session.admin) {
    const userData = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        admin: true,
        shifts: {
          select: {
            id: true,
            start: true,
            end: true,
            breaks: {
              select: {
                id: true,
                start: true,
                end: true,
                lunch: true
              }
            }
          }
        }
      }
    });

    res.json(userData);
  }

  res.status(401);
}

export async function getUsers(req: Request, res: Response) {
  const allUsers = await prisma.users.findMany();
  res.json(allUsers);
}

export async function getUsernames(req: Request, res: Response) {
  const userObjects = await prisma.users.findMany({
    select: {
      username: true
    }
  })

  const usernames: string[] = [];
  userObjects.forEach((userObject) => {
    usernames.push(userObject.username);
  })

  res.json(usernames);
}

export async function createUser(req: Request, res: Response) {
  const {username, password, admin} = req.body;

  const userExists = await checkUserNameExists(username);
  if (userExists) {
    res.status(409);
    res.send('username already exists');
    return;
  }

  bcrypt.genSalt(bcryptWorkFactor, (_err1: any, salt: string) => {
    bcrypt.hash(password, salt, async (_err2: any, hash: string) => {
      hash;
      const result = await prisma.users.create({
        data: { username, password: hash, admin}
      });
      res.status(200);
      res.end();
    });
  });
}

async function checkUserNameExists(username: string) {
  const user = await prisma.users.findFirst({
    where: { username }
  });
  if (user) return true;
  return false;
}

export async function login(req: Request, res: Response) {
  if (req.session.authenticated) {
    res.status(200);
    res.send('already_authenticated');
    return;
  }

  const { username, password} = req.body;
  const user = await prisma.users.findFirst({
    where: { username: username }
  });

  if (!user) {
    res.status(200);
    res.send('unknown_user');
    return;
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      req.session.userid = user.id;
      req.session.username = username;
      req.session.authenticated = true;
      req.session.admin = user.admin;
      res.status(200);
      res.cookie('username', username);
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

export async function checkAuthentication(req: Request, res: Response) {
  if (req.session.authenticated) {
    res.status(200);
    res.send('authenticated');
  } else {
    res.status(200);
    res.send("not_authenticated");
  }
}

export async function logout(req: Request, res: Response) {
  req.session.destroy(() => {
    res.status(200);
    res.end();
  });
}