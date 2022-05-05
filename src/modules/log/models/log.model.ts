import { Field, ObjectType, Int } from '@nestjs/graphql';

import { BaseModel } from '@Model/base.model';

@ObjectType()
export class Log extends BaseModel {
  @Field(() => Int)
  userId: number;

  @Field(() => String)
  moduleName: string;

  @Field(() => String)
  action: string;

  @Field(() => String)
  apiVersion: string;

  @Field(() => String)
  additionalContent: string;
}
