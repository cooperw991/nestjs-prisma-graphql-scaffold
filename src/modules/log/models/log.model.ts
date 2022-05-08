import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class LogModel {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

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
