import { HttpClient, HttpParams } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlaskApiService {
  private url: string = 'http://127.0.0.1:5000/info/stocklist';
  constructor(private http: HttpClient) {}

  getStockList(
    page: number = 1, limit: number = 12 
  ): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get(this.url, {
      params: params,
    }).pipe(delay(2000));
  }

  
}
