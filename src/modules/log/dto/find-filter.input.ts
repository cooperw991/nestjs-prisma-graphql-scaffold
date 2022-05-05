import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class LogsFindFilter {
  @Field(() => Int, {
    nullable: true,
  })
  userId?: number;

  @Field(() => String, {
    nullable: true,
  })
  moduleName?: string;

  @Field(() => String, {
    nullable: true,
  })
  action?: string;

  @Field(() => String, {
    nullable: true,
  })
  apiVersion?: string;

  @Field(() => String, {
    nullable: true,
  })
  additionalContent?: string;
}
