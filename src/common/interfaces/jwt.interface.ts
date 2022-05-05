export interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

export interface AccessToken {
  jwt: string;
}
