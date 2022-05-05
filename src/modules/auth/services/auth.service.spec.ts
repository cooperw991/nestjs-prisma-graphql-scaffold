import { TestingModule, Test } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';

import { I18nRequestScopeService } from 'nestjs-i18n';
import { createdUser } from '@Module/user/fake/user.fake';
import { UserService } from '@Module/user/services/user.service';
import { AuthService } from './auth.service';
import faker from '@faker-js/faker';
import { AccessToken } from '../../../common/interfaces/jwt.interface';

describe('UserService', () => {
  let service: AuthService;
  let userService: UserService;
  let i18n: I18nRequestScopeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useFactory: () => ({
            findUser: () => ({}),
            findUserByPhone: () => ({}),
          }),
        },
        {
          provide: ConfigService,
          useFactory: () => ({
            get: () => ({}),
          }),
        },
        {
          provide: I18nRequestScopeService,
          useFactory: () => ({
            t: () => '',
          }),
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userService = module.get(UserService);
    i18n = module.get(I18nRequestScopeService);
  });

  it('AuthService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test validateUser', () => {
    it('Should throw a UnauthorizedException if no user found', async () => {
      const payloadMock = {
        id: createdUser.id,
        exp: dayjs(faker.date.future()).unix(),
        iat: null,
      };

      const findSpy = jest
        .spyOn(userService, 'findUser')
        .mockResolvedValue(null);

      const exceptionSpy = jest.spyOn(i18n, 't');

      try {
        await service.validateUser(payloadMock);
      } catch (e) {
        expect(findSpy).toBeCalledWith(payloadMock.id);

        expect(exceptionSpy).toBeCalledWith('general.UNAUTHENTICATED');
      }
    });

    it('Should throw a UnauthorizedException if overtime', async () => {
      const payloadMock = {
        id: createdUser.id,
        exp: dayjs(faker.date.past()).unix(),
        iat: null,
      };

      const findSpy = jest
        .spyOn(userService, 'findUser')
        .mockResolvedValue(createdUser);

      const exceptionSpy = jest.spyOn(i18n, 't');

      try {
        await service.validateUser(payloadMock);
      } catch (e) {
        expect(findSpy).toBeCalledWith(payloadMock.id);

        expect(exceptionSpy).toBeCalledWith('general.UNAUTHENTICATED');
      }
    });

    it('Should return the found user', async () => {
      const payloadMock = {
        id: createdUser.id,
        exp: dayjs(faker.date.future()).unix(),
        iat: null,
      };

      const findSpy = jest
        .spyOn(userService, 'findUser')
        .mockResolvedValue(createdUser);

      const res = await service.validateUser(payloadMock);

      expect(findSpy).toBeCalledWith(createdUser.id);
      expect(res).toBe(createdUser);
    });
  });

  describe('Test signIn', () => {
    it('Should throw a UnauthorizedException if no user found', async () => {
      const { email } = createdUser;
      const password = faker.lorem.words();
      const findSpy = jest
        .spyOn(userService, 'findUserByPhone')
        .mockResolvedValue(createdUser);

      const authenticateSpy = jest
        .spyOn(service, 'authenticateUser')
        .mockResolvedValue(false);

      const exceptionSpy = jest.spyOn(i18n, 't');

      try {
        await service.signIn(email, password);
      } catch (e) {
        expect(findSpy).toBeCalledWith(email);
        expect(authenticateSpy).toBeCalledWith(createdUser, password);

        expect(exceptionSpy).toBeCalledWith('user.PASSWORD_INCORRECT');
      }
    });

    it('Should return the user with jwt', async () => {
      const { phone } = createdUser;
      const password = faker.lorem.words();
      const jwtMock = faker.random.alpha(32);
      const accessTokenMock: AccessToken = {
        jwt: jwtMock,
      };
      const findSpy = jest
        .spyOn(userService, 'findUserByPhone')
        .mockResolvedValue(createdUser);

      const authenticateSpy = jest
        .spyOn(service, 'authenticateUser')
        .mockResolvedValue(true);

      const createTokenSpy = jest
        .spyOn(service, 'createToken')
        .mockReturnValue(accessTokenMock);

      const res = await service.signIn(phone, password);

      expect(findSpy).toBeCalledWith(phone);
      expect(authenticateSpy).toBeCalledWith(createdUser, password);
      expect(createTokenSpy).toBeCalledWith(createdUser);
      expect(res).toBe(createdUser);
    });
  });

  describe('Test authenticateUser', () => {
    it('Should return false if no user', async () => {
      const res = await service.authenticateUser(undefined, '');

      expect(res).toBe(false);
    });

    it('Should return true', async () => {
      const { encryptPassword } = createdUser;
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      const password = faker.lorem.words();

      const res = await service.authenticateUser(createdUser, password);

      expect(compareSpy).toBeCalledWith(password, encryptPassword);
      expect(res).toBe(true);
    });
  });
});
