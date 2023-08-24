import {Injectable} from '@angular/core';
import {lastValueFrom} from "rxjs";
import {ApiService} from '@core/http';
import {DatabaseRecord, DataModel} from "@core/models/data.models";

@Injectable({
  providedIn: 'root'
})
export class DataService extends ApiService {
  private endpoint: string = '_panel';

  constructor() {
    super();
  }

  getModels() {
    const res = this._get<DataModel[]>(`${this.endpoint}`);
    return lastValueFrom(res);
  }

  getRecords(index: string) {
    const res = this._get<DatabaseRecord<any>>(`${this.endpoint}/${index}`);
    return lastValueFrom(res);
  }

  getRecordById(index: number, id: string) {
    const res = this._get<any>(`${this.endpoint}/${index}/${id}`);
    return lastValueFrom(res);
  }

  deleteRecord(index: number, id: string) {
    const res = this._delete<any>(`${this.endpoint}/${index}/${id}`);
    return lastValueFrom(res);
  }
}
