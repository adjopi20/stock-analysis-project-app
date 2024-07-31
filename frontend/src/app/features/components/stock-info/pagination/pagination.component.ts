import { Component, Input, input } from '@angular/core';
import {  StockInfoComponent } from '../stock-info/stock-info.component';
import { AllStockService } from '../../../all-stocks-service/all-stock.service';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [StockInfoComponent, NgClass, NgFor, NgIf, NgStyle],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  totalPage: number = 0;
  currentPage: number = 0;
  limit: number = 0;
  total: number = 0;
  isHovered: boolean = false;
  pagesToShow: number[] = [];

  constructor(private allStockService: AllStockService) {}

  ngOnInit(): void {
    combineLatest([
      //apabila terjadi perubahan
      this.allStockService.totalPage$,
      this.allStockService.currentPage$,
      this.allStockService.limit$,
      this.allStockService.total$,
    ]).subscribe(([totalPage, currentPage, limit, total]) => {
      if (
        this.totalPage !== totalPage ||
        this.currentPage !== currentPage ||
        this.limit !== limit ||
        this.total !== total
      ) {
        this.totalPage = totalPage;
        this.currentPage = currentPage;
        this.limit = limit;
        this.total = total;
        this.showPages();
      }

      console.log('currentpage pagination ' + this.currentPage);
      console.log('totalPage pagination ' + this.totalPage);
      console.log('limit pagination ' + this.limit);
    });

    this.showPages();
  }

  previousPage(): void {
    // this.isHovered = true;
    if (this.currentPage > 1) {
      this.allStockService.setCurrentPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    // this.isHovered = true;
    if (this.currentPage < this.totalPage) {
      this.allStockService.setCurrentPage(this.currentPage + 1);
    }
  }

  changePage(page: number): void {
    this.allStockService.setCurrentPage(page);
  }

  changeLimit(event: Event): void {
    const value = (event?.target as HTMLSelectElement).value;
    const limit = parseInt(value, 10);
    this.allStockService.setLimit(limit);
    this.changePage(1);
  }

  showPages(): void {
    this.pagesToShow = [];

    if (this.currentPage > 1) {
      this.pagesToShow.push(this.currentPage - 1);
    } else {
      this.pagesToShow.push(this.currentPage + 2);
    }

    this.pagesToShow.push(this.currentPage);

    if (this.currentPage < this.totalPage) {
      this.pagesToShow.push(this.currentPage + 1);
    } else {
      this.pagesToShow.push(this.currentPage - 2);
    }

    this.pagesToShow.sort((a, b) => a - b);
    console.log('this.pagesToShow' + this.pagesToShow);
  }
}
