export interface DatabaseRecord<T> {
  fields: { [x in keyof T]: T[x] },
  data: T[]
}

export interface Database {
  models: DataModel[],
  items: any
}

export interface DataModel {
  name: string;
  path: string;
  app: string;
  index: number;
}
