import { InputType, Field, registerEnumType } from '@nestjs/graphql';

export enum LogsFindOrderKeys {
  USER_ID = 'userId',
  MODULE_NAME = 'moduleName',
  ACTION = 'action',
  API_VERSION = 'apiVersion',
  ADDITIONAL_CONTENT = 'additionalContent',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

registerEnumType(LogsFindOrderKeys, {
  name: 'LogsFindOrderKeys',
});

@InputType()
export class LogsFindOrder {
  @Field(() => LogsFindOrderKeys)
  by: LogsFindOrderKeys;

  @Field(() => Boolean)
  asc: boolean;
}
