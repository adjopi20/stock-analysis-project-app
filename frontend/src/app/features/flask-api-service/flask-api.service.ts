import { HttpClient, HttpParams } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { delay, map, multicast, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlaskApiService {
  private infoUrl: string = 'http://127.0.0.1:5000/info/stocklist';
  private filterOptionsUrl = 'http://127.0.0.1:5000/filter-options';
  constructor(private http: HttpClient) {}

  getStockList(
    listingBoard?: string,  
    sector?: string,
    industry?: string,
    recommendation?: string
    
  ): Observable<any> {
    let params = new HttpParams();

    if (listingBoard) {
      params = params.set('listingBoard', listingBoard);
    }
    if (sector) {
      params = params.set('sector', sector);
    }
    if (industry) {
      params = params.set('industry', industry);
    }
    if(recommendation){
      params = params.set('recommendation', recommendation)
    }

  
    
    return this.http.get(this.infoUrl, {
      params: params,
    });
  }

  getFilterOptions(): Observable<any>{
    return this.http.get(this.filterOptionsUrl)
  }
  
}
