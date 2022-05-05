import { Field, ObjectType, Int, HideField } from '@nestjs/graphql';

import { registerEnumType } from '@nestjs/graphql';

import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @HideField()
  creatorId?: number;

  @HideField()
  modifierId?: number;

  @HideField()
  deletedAt?: Date;
}
