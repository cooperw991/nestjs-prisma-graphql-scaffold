import { faker } from '@faker-js/faker';

import { Log } from '@prisma/client';

export const apiVersion = faker.random.alpha(5);

export const newLogInput = {
  userId: faker.datatype.number(),
  moduleName: faker.lorem.words(),
  action: faker.lorem.words(),
  additionalContent: faker.lorem.words(),
};

export const createdLog: Log = {
  ...newLogInput,
  id: faker.datatype.number(),
  apiVersion,
  createdAt: new Date(),
  updatedAt: new Date(),
};
