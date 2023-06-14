import {Injectable} from '@angular/core';
import {lastValueFrom} from "rxjs";
import {ApiService} from '@core/http';

@Injectable({
  providedIn: 'root'
})
export class DataService extends ApiService {
  private endpoint: string = 'photos';

  constructor() {
    super();
  }

  getModels() {
    const res = this._get<any>('assets/db.json');
    return lastValueFrom(res);
  }
}
