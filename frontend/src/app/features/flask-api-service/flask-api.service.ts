import { HttpClient, HttpParams } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlaskApiService {
  constructor(private http: HttpClient) {}

  getStockList(
    // page: number = 0, limit: number = 12 
  ): Observable<any> {
    // let params = new HttpParams().set('page', page.toString()).set('perPage', limit.toString());

    return this.http.get('http://127.0.0.1:5000/info/stocklist', {
      // params: params,
    });
  }
}
