import { Request, Response } from 'express';
import { PrismaClient, shifts } from '@prisma/client';
import { getOpenBreakForShift } from '../breaks/break-service';

const prisma = new PrismaClient();

export async function startShift(req: Request, res: Response) {
  const hasOpenShift = await userHasOpenShift(req.session.userid);
  if (!hasOpenShift) {
    const newShift = await prisma.shifts.create({
      data: {
        user_id: req.session.userid,
        start: new Date()
      }
    });

    if (newShift) {
      res.status(204);
      res.end();
    }
  }

  res.status(409);
  res.end();
}

export async function endShift(req: Request, res: Response) {
  const currentShift = await prisma.shifts.findFirst({
    where: {
      user_id: req.session.userid,
      end: null
    }
  });

  if (currentShift) {
    let updatedShift = null;
    const currentBreak = await getOpenBreakForShift(currentShift.id);

    if (!currentBreak) {
      updatedShift = await prisma.shifts.update({
        where: {
          id: currentShift.id
        },
        data: {
          end: new Date()
        }
      })
    }

    if (updatedShift) {
      res.status(204);
      res.end();
    }
  }

  res.status(409);
  res.end();
}

async function userHasOpenShift(user_id: number): Promise<boolean> {
  const openShift = await getOpenShift(user_id);
  if (openShift) {
    return true;
  }
  return false;
}

async function getOpenShift(user_id: number): Promise<shifts> {
  const openShift = await prisma.shifts.findFirst({
    where: {
      user_id: user_id,
      end: null
    }
  });

  return openShift;
}

export async function getOpenShiftId(user_id: number): Promise<number> {
  const openShift = await getOpenShift(user_id);
  if (openShift) {
    return openShift.id;
  }
  return null;
}