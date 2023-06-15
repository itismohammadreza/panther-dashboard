import {Injectable} from '@angular/core';
import {lastValueFrom} from "rxjs";
import {ApiService} from '@core/http';
import {DataModel, ModelItem} from "@core/models/data.models";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataService extends ApiService {
  private endpoint: string = 'photos';

  constructor() {
    super();
  }

  getModels() {
    const db = this._get<any>('assets/db.json');
    const res = db.pipe(map(x => x.models));
    return lastValueFrom<DataModel[]>(res);
  }

  getItems(model: string) {
    const db = this._get<any>('assets/db.json');
    const res = db.pipe(map(x => x.items[model]));
    return lastValueFrom<ModelItem[]>(res);
  }
}
