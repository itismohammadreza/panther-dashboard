import {Injectable} from '@angular/core';
import {lastValueFrom} from "rxjs";
import {ApiService} from '@core/http';
import {Database, DatabaseItem, TestModelItem} from "@core/models/data.models";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataService extends ApiService {
  private endpoint: string = '';

  constructor() {
    super();
  }

  getModels() {
    const db = this._get<Database>(this.endpoint);
    const res = db.pipe(map(x => x.models));
    return lastValueFrom(res);
  }

  getItems(model: string) {
    const db = this._get<Database>(this.endpoint);
    const res = db.pipe(map(x => x.items[model] as DatabaseItem<TestModelItem>));
    return lastValueFrom(res);
  }
}
