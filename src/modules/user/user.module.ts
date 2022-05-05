import { Module } from '@nestjs/common';
import { UserService } from '@Module/user/services/user.service';
import { UserResolver } from '@Module/user/resolvers/user.resolver';

@Module({
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
