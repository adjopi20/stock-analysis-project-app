import { HttpClient, HttpParams } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { delay, map, multicast, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlaskApiService {
  private url: string = 'http://127.0.0.1:5000';
  private infoUrl: string = 'http://127.0.0.1:5000/info/stocklist';
  private filterOptionsUrl = 'http://127.0.0.1:5000/filter-options';
  // private histItemUrl = 'http://127.0.0.1:5000/histogram-analysis-for-sector-2/<sector>/<metric>';

  constructor(private http: HttpClient) {}

  getStockList(
    listingBoard?: string,  
    sector?: string,
    industry?: string,
    recommendation?: string,
    minMarketCap?: number,
    maxMarketCap?: number,
    minPrice?: number,
    maxPrice?:number,
    minDividendRate?:number,
    maxDividendRate?:number,
    sortBy?: string,
    order?: string
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
    if (minMarketCap){
      params = params.set('minMarketCap', minMarketCap)
    }
    if (maxMarketCap){
      params = params.set('maxMarketCap', maxMarketCap)
    }
    if (minPrice){
      params = params.set('minPrice', minPrice)
    }
    if (maxPrice){
      params = params.set('maxPrice', maxPrice)
    }
    if (minDividendRate){
      params = params.set('minDividendRate', minDividendRate)
    }
    if (maxDividendRate){
      params = params.set('maxDividendRate', maxDividendRate)
    }
    if (sortBy){
      params = params.set('sortBy', sortBy)
    }
    if (order){
      params = params.set('order', order)
    }
    
    
    return this.http.get(this.infoUrl, {
      params: params,
    });
  }

  getFilterOptions(): Observable<any>{
    return this.http.get(this.filterOptionsUrl)
  }

  getHistogramItems(
    sector: string,
    metric: string, 
    listingBoard?: string,  
    industry?: string,
  ): Observable<any>{
    let params = new HttpParams();

    if (listingBoard) {
      params = params.set('listingBoard', listingBoard);
    }
    if (industry) {
      params = params.set('industry', industry);
    }
    return this.http.get('http://127.0.0.1:5000/histogram-analysis-for-sector-2/'+sector+'/'+metric, {params: params});

  }

  getHistogramPic(sector: string, metric: string): Observable<any>{
    const url = `${this.url}/hist/${sector}/${metric}/hist.png`
    return this.http.get(url, {responseType: 'blob'});
  }
  
}
