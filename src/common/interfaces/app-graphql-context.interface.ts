import * as Dataloader from 'dataloader';

type GraphqlContext = {
  req: Request;
  res: Response;
};

export type AppLoaders<T> = {
  [key: string]: Dataloader<number | number[], T>;
};

export type AppGraphqlContext<T> = AppLoaders<T> & GraphqlContext;
