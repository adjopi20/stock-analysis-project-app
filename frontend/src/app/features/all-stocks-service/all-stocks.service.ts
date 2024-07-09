import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllStocksService {

  constructor(private http: HttpClient) {}
  
  getStockList(): Observable<any> {
    return this.http.get('http://127.0.0.1:5000/info/stocklist'); 
  }
    
}

