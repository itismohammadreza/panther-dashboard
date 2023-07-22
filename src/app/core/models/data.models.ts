export interface DatabaseItem<T> {
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
  index: string;
}

export interface TestModelItem {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
}
