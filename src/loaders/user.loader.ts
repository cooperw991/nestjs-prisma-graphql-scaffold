import DataLoader from 'dataloader';
import R from 'ramda';
import { PrismaClient } from '@prisma/client';

import { Managers } from '@Dto/managers.dto';

export const managersLoader = () => {
  return new DataLoader(async (ids: number[][]): Promise<Managers[]> => {
    const flattenIds: number[] = [...new Set(R.flatten(ids) as number[])];
    if (!flattenIds.length) {
      return [null, null];
    }

    const prisma = new PrismaClient();

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              in: flattenIds,
            },
          },
          {
            deletedAt: null,
          },
        ],
      },
    });

    return ids.map((idPair) => {
      const managers = users.filter((user) => R.includes(user.id, idPair));
      if (!managers) {
        return {
          createdBy: null,
          modifiedBy: null,
        };
      }
      return {
        createdBy: managers.find((manager) => manager.id === idPair[0]),
        modifiedBy: managers.find((manager) => manager.id === idPair[1]),
      };
    });
  });
};
