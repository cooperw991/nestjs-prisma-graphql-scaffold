import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EditUserInput {
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
}
