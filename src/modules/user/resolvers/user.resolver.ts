import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { UserEntity } from '@Decorator/user.decorator';
import { PagingQuery } from '@Dto/paging-query.input';
import { GqlAuthGuard } from '@Guard/auth.guard';
import { User as UserModel } from '@Module/user/models/user.model';
import { User } from '../models/user.model';
import { NewUserInput } from '../dto/new-user.input';
import { EditUserInput } from '../dto/edit-user.input';
import { UsersFindFilter } from '../dto/find-filter.input';
import { UsersFindOrder } from '../dto/find-order.input';
import { UsersWithPaging } from '../dto/paging.dto';
import { UserService } from '../services/user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async findUser(
    @Args({ name: 'userId', type: () => Int }) userId: number,
  ): Promise<User> {
    return this.userService.findUser(userId);
  }

  @Query(() => UsersWithPaging)
  @UseGuards(GqlAuthGuard)
  async findUsers(
    @Args({ name: 'where', type: () => UsersFindFilter, nullable: true })
    where: UsersFindFilter,
    @Args({ name: 'order', type: () => [UsersFindOrder], nullable: true })
    order: UsersFindOrder[],
    @Args({ name: 'paging', type: () => PagingQuery, nullable: true })
    paging: PagingQuery,
  ): Promise<UsersWithPaging> {
    return this.userService.findUsers(where, order, paging);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async createUser(
    @UserEntity() me: UserModel,
    @Args({ name: 'input', type: () => NewUserInput }) input: NewUserInput,
  ): Promise<User> {
    return this.userService.createUser(input, me.id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @UserEntity() me: UserModel,
    @Args({ name: 'userId', type: () => Int }) userId: number,
    @Args({ name: 'input', type: () => EditUserInput }) input: EditUserInput,
  ): Promise<User> {
    return this.userService.updateUser(userId, input, me.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUser(
    @UserEntity() me: UserModel,
    @Args({ name: 'userId', type: () => Int }) userId: number,
  ): Promise<boolean> {
    return this.userService.deleteUser(userId, me.id);
  }
}
