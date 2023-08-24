import {Injectable} from '@angular/core';
import {lastValueFrom} from "rxjs";
import {ApiService} from '@core/http';
import {ModelData, Model} from "@core/models/data.models";

@Injectable({
  providedIn: 'root'
})
export class DataService extends ApiService {
  private endpoint: string = '_panel';

  constructor() {
    super();
  }

  getModels() {
    const res = this._get<Model[]>(this.endpoint);
    return lastValueFrom(res);
  }

  getModelData(index: number) {
    const res = this._get<ModelData>(`${this.endpoint}/${index}`);
    return lastValueFrom(res);
  }

  getModelDataById(index: number, id: string) {
    const res = this._get<any>(`${this.endpoint}/${index}/${id}`);
    return lastValueFrom(res);
  }

  deleteModelData(index: number, id: string) {
    const res = this._delete<any>(`${this.endpoint}/${index}/${id}`);
    return lastValueFrom(res);
  }
}
