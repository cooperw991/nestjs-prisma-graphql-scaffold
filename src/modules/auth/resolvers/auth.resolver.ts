import { Resolver, Args, Mutation } from '@nestjs/graphql';

import { AuthService } from '../services/auth.service';
import { UserWithJWT } from '../dto/user-with-jwt.object';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserWithJWT)
  async signIn(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<UserWithJWT> {
    return this.authService.signIn(email, password);
  }
}
