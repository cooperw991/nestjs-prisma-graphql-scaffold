export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  gql: GraphqlConfig;
  security: SecurityConfig;
  version: VersionConfig;
  swagger: SwaggerConfig;
}

export interface NestConfig {
  port: number;
  fallbackLanguage: string;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  jwtSecret: string;
  bcryptSaltOrRound: string | number;
}

export interface VersionConfig {
  version: string;
}

export interface SwaggerConfig {
  title: string;
  description?: string;
  version: string;
}
