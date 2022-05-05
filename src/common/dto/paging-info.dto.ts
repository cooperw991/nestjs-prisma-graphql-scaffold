import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class PagingInfo {
  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  currentOffset: number;

  @Field(() => Int)
  take: number;
}
