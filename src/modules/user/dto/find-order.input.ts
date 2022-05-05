import { InputType, Field, registerEnumType } from '@nestjs/graphql';

export enum UsersFindOrderKeys {
  PHONE = 'phone',
  EMAIL = 'email',
  NAME = 'name',
  ENCRYPT_PASSWORD = 'encryptPassword',
  CREATOR_ID = 'creatorId',
  MODIFIER_ID = 'modifierId',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

registerEnumType(UsersFindOrderKeys, {
  name: 'UsersFindOrderKeys',
});

@InputType()
export class UsersFindOrder {
  @Field(() => UsersFindOrderKeys)
  by: UsersFindOrderKeys;

  @Field(() => Boolean)
  asc: boolean;
}
