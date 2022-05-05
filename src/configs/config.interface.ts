export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
}

export interface NestConfig {
  port: number;
  fallbackLanguage: string;
}

export interface CorsConfig {
  enabled: boolean;
}
