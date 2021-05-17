import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stock, StockOwner, SplitType } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private _http: HttpClient) { }

  getData(): Observable<Stock[]> {
     return this._http.get<Stock[]>('/assets/mocks/data.json');
  }

  getOwners(): Observable<StockOwner[]> {
    return this._http.get<StockOwner[]>('/assets/mocks/owners.json');
  }

  getSplitTypes(): Observable<SplitType[]> { // or it could be config if we don't create such data on back-end
    return this._http.get<SplitType[]>('/assets/mocks/split-types.json');
  }
}
