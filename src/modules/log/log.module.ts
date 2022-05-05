import { Global, Module } from '@nestjs/common';
import { LogService } from '@Module/log/services/log.service';
import { LogResolver } from '@Module/log/resolvers/log.resolver';

@Global()
@Module({
  providers: [LogService, LogResolver],
  exports: [LogService],
})
export class LogModule {}
