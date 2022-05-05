import { faker } from '@faker-js/faker';
import R from 'ramda';

import { Role, User } from '@prisma/client';

export const creatorId = faker.datatype.number();
export const modifierId = faker.datatype.number();

export const newUserInput = {
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  name: faker.lorem.word(),
  password: faker.lorem.word(),
};

export const editUserInput = {
  phone: faker.phone.phoneNumber(),
  email: faker.internet.email(),
  name: faker.lorem.word(),
};

export const createdUser: User = {
  ...R.dissoc('password', newUserInput),
  id: faker.datatype.number(),
  encryptPassword: faker.random.alpha(30),
  creatorId,
  modifierId: creatorId,
  role: Role.ADMIN,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export const updatedUser: User = {
  ...createdUser,
  ...editUserInput,
  modifierId,
};

export const deletedUser: User = {
  ...createdUser,
  deletedAt: new Date(),
  modifierId,
};
