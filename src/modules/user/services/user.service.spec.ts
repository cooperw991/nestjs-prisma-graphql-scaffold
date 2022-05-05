import { TestingModule, Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import R from 'ramda';
import bcrypt from 'bcrypt';

import { I18nRequestScopeService } from 'nestjs-i18n';
import { PrismaService } from 'nestjs-prisma';
import { FakePrismaClient } from '@Helper/fake-prisma-client.helper';
import { LogService } from '@Module/log/services/log.service';
import {
  newUserInput,
  createdUser,
  editUserInput,
  updatedUser,
  deletedUser,
  creatorId,
  modifierId,
} from '../fake/user.fake';
import { UserService } from './user.service';
import { Role } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let config: ConfigService;
  let i18n: I18nRequestScopeService;
  let logService: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useFactory: () => ({
            user: new FakePrismaClient(),
          }),
        },
        {
          provide: ConfigService,
          useFactory: () => ({
            get: () => {
              return {
                bcryptSaltOrRound: 1,
              };
            },
          }),
        },
        {
          provide: I18nRequestScopeService,
          useFactory: () => ({
            t: () => '',
          }),
        },
        {
          provide: LogService,
          useFactory: () => ({
            createLog: () => ({}),
          }),
        },
      ],
    }).compile();

    service = module.get(UserService);
    prisma = module.get(PrismaService);
    config = module.get(ConfigService);
    i18n = module.get(I18nRequestScopeService);
    logService = module.get(LogService);
  });

  it('UserService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test createUser', () => {
    it('Should create a new user', async () => {
      const { encryptPassword } = createdUser;
      const mockedHash = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue(encryptPassword);
      const checkConfilctSpy = jest.spyOn(service, 'checkConfilct');

      const createSpy = jest
        .spyOn(prisma.user, 'create')
        .mockResolvedValue(createdUser);

      const logSpy = jest.spyOn(logService, 'createLog');

      const res = await service.createUser(newUserInput, creatorId);

      expect(logSpy).toBeCalledWith({
        userId: creatorId,
        moduleName: 'user',
        action: 'create',
        additionalContent: JSON.stringify(newUserInput),
      });

      expect(checkConfilctSpy).toBeCalledWith({
        phone: newUserInput.phone,
      });

      expect(mockedHash).toBeCalledWith(
        newUserInput.password,
        config.get('security').bcryptSaltOrRound,
      );

      expect(createSpy).toBeCalledWith({
        data: {
          ...R.dissoc('password', newUserInput),
          encryptPassword: createdUser.encryptPassword,
          role: Role.ADMIN,
          creatorId,
          modifierId: creatorId,
        },
      });

      expect(res).toBe(createdUser);
    });
  });

  describe('Test deleteUser', () => {
    it('Should return true if user is null', async () => {
      const { id } = createdUser;
      const findUserSpy = jest
        .spyOn(prisma.user, 'findFirst')
        .mockResolvedValue(null);

      jest.spyOn(logService, 'createLog');

      const res = await service.deleteUser(id, modifierId);

      expect(findUserSpy).toBeCalledWith({
        where: {
          id,
        },
      });

      expect(res).toBe(true);
    });

    it('Should soft delete the user', async () => {
      const { id } = createdUser;
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(createdUser);

      const deleteUserSpy = jest
        .spyOn(prisma.user, 'delete')
        .mockResolvedValue(deletedUser);

      const logSpy = jest.spyOn(logService, 'createLog');

      const res = await service.deleteUser(id, modifierId);

      expect(deleteUserSpy).toBeCalledWith({
        where: {
          id,
        },
      });

      expect(logSpy).toBeCalledWith({
        userId: modifierId,
        moduleName: 'user',
        action: 'delete',
        additionalContent: JSON.stringify({}),
      });

      expect(res).toBe(true);
    });
  });

  describe('Test updateUser', () => {
    it('Should update the user', async () => {
      const { id } = createdUser;
      const findUserSpy = jest
        .spyOn(service, 'findUser')
        .mockResolvedValue(createdUser);

      const checkConfilctSpy = jest.spyOn(service, 'checkConfilct');

      const updateSpy = jest
        .spyOn(prisma.user, 'update')
        .mockResolvedValue(updatedUser);

      const logSpy = jest.spyOn(logService, 'createLog');

      const res = await service.updateUser(id, editUserInput, modifierId);

      expect(findUserSpy).toBeCalledWith(id);

      expect(checkConfilctSpy).toBeCalledWith({
        phone: editUserInput.phone,
      });

      expect(updateSpy).toBeCalledWith({
        data: {
          ...editUserInput,
          modifierId,
        },
        where: {
          id,
        },
      });

      expect(logSpy).toBeCalledWith({
        userId: modifierId,
        moduleName: 'user',
        action: 'update',
        additionalContent: JSON.stringify(editUserInput),
      });

      expect(res).toBe(updatedUser);
    });
  });

  describe('Test findUser', () => {
    it('Should throw a NotFoundException with wrong id', async () => {
      const { id } = createdUser;
      const findUserSpy = jest
        .spyOn(prisma.user, 'findFirst')
        .mockResolvedValue(null);

      const exceptionSpy = jest.spyOn(i18n, 't');

      try {
        await service.findUser(id);
      } catch (e) {
        expect(findUserSpy).toBeCalledWith({
          where: {
            id,
          },
        });

        expect(exceptionSpy).toBeCalledWith('general.NOT_FOUND', {
          args: {
            model: 'User',
            condition: 'id',
            value: id,
          },
        });
      }
    });

    it('Should find the user', async () => {
      const { id } = createdUser;
      const findUserSpy = jest
        .spyOn(prisma.user, 'findFirst')
        .mockResolvedValue(createdUser);

      const res = await service.findUser(id);

      expect(findUserSpy).toBeCalledWith({
        where: {
          id,
          deletedAt: null,
        },
      });

      expect(res).toBe(createdUser);
    });
  });

  describe('Test findUserByPhone', () => {
    it('Should throw a NotFoundException with wrong phone', async () => {
      const { phone } = createdUser;
      const findUserSpy = jest
        .spyOn(prisma.user, 'findFirst')
        .mockResolvedValue(null);

      const exceptionSpy = jest.spyOn(i18n, 't');

      try {
        await service.findUserByPhone(phone);
      } catch (e) {
        expect(findUserSpy).toBeCalledWith({
          where: {
            phone,
            deletedAt: null,
          },
        });

        expect(exceptionSpy).toBeCalledWith('general.NOT_FOUND', {
          args: {
            model: 'User',
            condition: 'phone',
            value: phone,
          },
        });
      }
    });

    it('Should find the user', async () => {
      const { phone } = createdUser;

      const findUserSpy = jest
        .spyOn(prisma.user, 'findFirst')
        .mockResolvedValue(createdUser);

      const res = await service.findUserByPhone(phone);

      expect(findUserSpy).toBeCalledWith({
        where: {
          phone,
          deletedAt: null,
        },
      });

      expect(res).toBe(createdUser);
    });
  });

  describe('Test checkConfilct', () => {
    it('Should throw a ConflictException', async () => {
      const { phone } = createdUser;

      const findUserSpy = jest
        .spyOn(prisma.user, 'findFirst')
        .mockResolvedValue(createdUser);

      const exceptionSpy = jest.spyOn(i18n, 't');

      try {
        await service.checkConfilct(createdUser);
      } catch (e) {
        expect(findUserSpy).toBeCalledWith({
          where: {
            phone,
            deletedAt: null,
          },
        });

        expect(exceptionSpy).toBeCalledWith('user.PHONE_CONFLICT');
      }
    });
  });
});
