// export interface DatabaseModel<T> {
//   fields: { [x in keyof T]: T[x] },
//   data: T[]
// }

export interface ModelData {
  fields: any;
  data: any[];
}

export interface Model {
  name: string;
  path: string;
  app: string;
  index: number;
}
