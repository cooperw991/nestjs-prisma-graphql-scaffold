import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UsersFindFilter {
  @Field(() => String, {
    nullable: true,
  })
  phone: string | null;

  @Field(() => String, {
    nullable: true,
  })
  email: string | null;

  @Field(() => String, {
    nullable: true,
  })
  username: string | null;

  @Field(() => String, {
    nullable: true,
  })
  encryptPassword: string | null;

  @Field(() => Int, {
    nullable: true,
  })
  creatorId: number | null;

  @Field(() => Int, {
    nullable: true,
  })
  modifierId: number | null;
}
