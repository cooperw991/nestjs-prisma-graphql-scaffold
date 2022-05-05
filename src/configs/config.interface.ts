export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  gql: GraphqlConfig;
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
