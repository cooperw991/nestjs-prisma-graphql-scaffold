import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EditUserInput {
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
  username?: string;
}
