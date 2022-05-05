import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UsersFindFilter {
  @Field(() => String, {
    nullable: true,
  })
  phone?: string;

  @Field(() => String, {
    nullable: true,
  })
  email?: string;

  @Field(() => String, {
    nullable: true,
  })
  name?: string;

  @Field(() => String, {
    nullable: true,
  })
  encryptPassword?: string;

  @Field(() => Int, {
    nullable: true,
  })
  creatorId?: number;

  @Field(() => Int, {
    nullable: true,
  })
  modifierId?: number;
}
