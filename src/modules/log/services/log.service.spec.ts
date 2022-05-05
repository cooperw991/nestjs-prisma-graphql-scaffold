import { TestingModule, Test } from '@nestjs/testing';

import { I18nRequestScopeService } from 'nestjs-i18n';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { FakePrismaClient } from '@Helper/fake-prisma-client.helper';
import { newLogInput, createdLog, apiVersion } from '../fake/log.fake';
import { LogService } from './log.service';

describe('LogService', () => {
  let service: LogService;
  let prisma: PrismaService;
  let i18n: I18nRequestScopeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        {
          provide: PrismaService,
          useFactory: () => ({
            log: new FakePrismaClient(),
          }),
        },
        {
          provide: ConfigService,
          useFactory: () => ({
            get: () => {
              return {
                version: apiVersion,
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
      ],
    }).compile();

    service = module.get(LogService);
    prisma = module.get(PrismaService);
    i18n = module.get(I18nRequestScopeService);
  });

  it('LogService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test createLog', () => {
    it('Should create a new log', async () => {
      const createSpy = jest
        .spyOn(prisma.log, 'create')
        .mockResolvedValue(createdLog);

      const res = await service.createLog(newLogInput);

      expect(createSpy).toBeCalledWith({
        data: {
          ...newLogInput,
          apiVersion: service.apiVersion,
        },
      });

      expect(res).toBe(createdLog);
    });
  });

  describe('Test findLog', () => {
    it('Should throw a NotFoundException with wrong id', async () => {
      const { id } = createdLog;
      const findLogSpy = jest
        .spyOn(prisma.log, 'findFirst')
        .mockResolvedValue(null);

      const exceptionSpy = jest.spyOn(i18n, 't');

      try {
        await service.findLog(id);
      } catch (e) {
        expect(findLogSpy).toBeCalledWith({
          where: {
            id,
          },
        });

        expect(exceptionSpy).toBeCalledWith('general.NOT_FOUND', {
          args: {
            model: 'Log',
            condition: 'id',
            value: id,
          },
        });
      }
    });

    it('Should find the log', async () => {
      const { id } = createdLog;
      const findLogSpy = jest
        .spyOn(prisma.log, 'findFirst')
        .mockResolvedValue(createdLog);

      const res = await service.findLog(id);

      expect(findLogSpy).toBeCalledWith({
        where: {
          id,
        },
      });

      expect(res).toBe(createdLog);
    });
  });
});
