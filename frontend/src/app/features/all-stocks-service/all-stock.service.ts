import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllStockService {

  constructor() { }

  // first we create behaviour subject variable
  private currentPageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private totalPageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private limitSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // second we create observable variable because we need to interact with http request
  currentPage$: Observable<number> = this.currentPageSubject.asObservable();
  totalPage$: Observable<number>= this.totalPageSubject.asObservable();
  limit$: Observable<number> = this.limitSubject.asObservable();

  setCurrentPage(page: number): void{//auto emit data when we call this function
    this.currentPageSubject.next(page);
  }

  setTotalPage(totalPage: number): void{//jadi kita set total page nya dari metod ini dan auto emit ke behaviour subject nya
    this.totalPageSubject.next(totalPage);
  }

  setLimit(limit: number): void{
    this.limitSubject.next(limit)
  }

  getCurrentPage(): number{
    return this.currentPageSubject.value;
  }

  getTotalPage(): number{
    return this.totalPageSubject.value;
  }

  getLimit(): number{
    return this.limitSubject.value
  }


}
