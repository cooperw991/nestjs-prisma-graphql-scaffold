import { InputType, Field, Int } from '@nestjs/graphql';
import { LessOrEqualThan } from '@Decorator/less-or-equal-than.decorator';

const limit = 500;

@InputType()
export class PagingQuery {
  @Field(() => Int, { nullable: true })
  skip: number;

  @Field(() => Int, { nullable: true })
  @LessOrEqualThan(limit, {
    message: `limit number must less than ${limit}`,
  })
  take: number;
}
