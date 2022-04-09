import { Request, Response } from 'express';
import { breaks, PrismaClient } from '@prisma/client';
import { getOpenShiftId } from '../shifts/shift-service';

const prisma = new PrismaClient();

export async function startBreak(req: Request, res: Response) {
  console.log(req.session.userid);
  const hasOpenBreak = await userHasOpenBreak(req.session.userid);

  if (!hasOpenBreak) {
    const openShiftId = await getOpenShiftId(req.session.userid);
    if (openShiftId) {
      const newBreak = await prisma.breaks.create({
        data: {
          start: new Date(),
          lunch: req.body.lunch,
          shifts: {
            connect: { id: openShiftId }
          }
        }
      });

      if (newBreak) {
        res.status(200);
        res.end();
      }
    }
  }

  res.status(409);
  res.end();
}

export async function endBreak(req: Request, res: Response) {
  const openShiftId = await getOpenShiftId(req.session.userid);

  if (openShiftId) {
    const currentBreak = await prisma.breaks.findFirst({
      where: {
        shift_id: openShiftId,
        end: null
      }
    });

    let updatedBreak = null;
    if (currentBreak) {
      updatedBreak = await prisma.breaks.update({
        where: {
          id: currentBreak.id
        },
        data: {
          end: new Date()
        }
      })
    }

    if (updatedBreak) {
      res.status(200);
      res.end();
    }
  }

  res.status(409);
  res.end();
}


async function userHasOpenBreak(user_id: number): Promise<boolean> {
  const openBreak = await getOpenBreak(user_id);
  if (openBreak) {
    return true;
  }
  return false;
}

export async function getOpenBreakForShift(shift_id: number): Promise<breaks> {
  const openBreak = await prisma.breaks.findFirst({
    where: {
      shift_id: shift_id,
      end: null
    }
  });

  return openBreak;
}

async function getOpenBreak(user_id: number): Promise<breaks> {
  const openShiftId = await getOpenShiftId(user_id);
  if (openShiftId) {
    return getOpenBreakForShift(openShiftId);
  }

  return null;
}
