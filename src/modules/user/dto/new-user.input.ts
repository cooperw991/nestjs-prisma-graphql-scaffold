import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NewUserInput {
  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, {
    nullable: true,
  })
  username: string | null;

  @Field(() => String)
  password: string;
}
