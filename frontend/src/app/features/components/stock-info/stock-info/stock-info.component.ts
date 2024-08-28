import { Component, Self, SkipSelf } from '@angular/core';
import { FlaskApiService } from '../../../flask-api-service/flask-api.service';
import { AllStockService } from '../../../all-stocks-service/all-stock.service';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { catchError, toArray } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FilterContainerComponent } from '../filter-container/filter-container.component';
import { ListingBoardService } from '../../../../shared/service/listingBoardService/listing-board.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stock-info',
  standalone: true,
  imports: [
    NgFor,
    JsonPipe,
    SideNavComponent,
    CommonModule,
    PaginationComponent,
    FilterContainerComponent,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './stock-info.component.html',
  styleUrl: './stock-info.component.scss',
})
export class StockInfoComponent {
  // data = new Perform<[]>(); //jangan lupa sertakan <> untuk menspesifikkan output/keluaran fungsi kek di java kan "public dtype namafungsi(dtype parameter)"
  data: any[] = [];
  limitedData: any[] = [];

  sector: any[] = [];
  industry: any[] = [];
  listingBoard: any[] = [];
  recommendation: any[] = [];

  total: number = 0;
  currentPage: number = 1;
  limit: number = 0;
  totalPage: number = 0;
  chosenItems: number = 0;

  isLoading: boolean = false;
  hasError: boolean = false;
  isLogin: boolean = false;

  // Maintain the state of the current filters
  currentListingBoard?: string;
  currentSector?: string;
  currentIndustry?: string;
  currentRecommendation?: string;
  currentMinMarketCap?: number;
  currentMaxMarketCap?: number;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentMinDividendRate?: number;
  currentMaxDividendRate?: number;
  currentSortBy?: string;
  currentOrder?: string;

  constructor(
    @SkipSelf() private apiService: FlaskApiService,
    private allStockService: AllStockService,
    protected lbs: ListingBoardService
  ) {}

  ngOnInit() {
    this.allStockService.currentPage$.subscribe((currentPage) => {
      if (this.currentPage !== currentPage) {
        this.currentPage = currentPage;
        // this.getAllStock(
        //   this.currentPage, this.limit
        // );
        this.limitDisplayedData();
      }
      console.log('Current page after subscription: ' + this.currentPage);
    });

    this.allStockService.limit$.subscribe((limit) => {
      if (this.limit !== limit) {
        this.limit = limit;
        // this.getAllStock(
        //   this.currentPage, this.limit
        // );
        this.limitDisplayedData();
      }
      console.log('Limit after subscription: ' + this.limit);
    });

    this.allStockService.totalPage$.subscribe((totalPage) => {
      // if (totalPage !== this.totalPage){
      this.totalPage = totalPage;
      //   this.getAllStock(this.currentPage, this.limit)
      // }
      console.log('totalPage d aft subs ' + this.totalPage);
    });

    this.allStockService.total$.subscribe((total) => {
      this.total = total;
      console.log('totalPage d aft subs ' + this.totalPage);
    });

    // Initial fetch
    this.getAllStock();
    this.getFilterOptions();
  }

  getAllStock() {
    this.isLoading = true;
    this.apiService
      .getStockList(
        this.currentListingBoard,
        this.currentSector,
        this.currentIndustry,
        this.currentRecommendation,
        this.currentMinMarketCap,
        this.currentMaxMarketCap,
        this.currentMinPrice,
        this.currentMaxPrice,
        this.currentMinDividendRate,
        this.currentMaxDividendRate,
        this.currentSortBy,
        this.currentOrder
      )
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          this.hasError = true;
          console.error('Error fetching stock list', error);
          return [];
        })
      )
      .subscribe((data: any) => {
        this.data = data.data;
        this.total = data.total;
        this.allStockService.setTotal(this.total);
        this.chosenItems = data.totalChosenItems;
        this.isLoading = false;
        this.hasError = false;
        this.isLogin = false;

        this.industry = [...new Set(this.data.map((item) => item.industry))];

        this.limitDisplayedData();

        // console.log('Data Dashboard:',  this.data.length);
        // console.log('Total Dashboard:', this.total);
        // console.log('Chosen Items Dashboard:', this.chosenItems);
      });
  }

  getFilterOptions() {
    this.apiService
      .getFilterOptions()
      .subscribe({
        next: (data: any) => {
          this.listingBoard = data.listingBoard;
          this.sector = data.sector;
          this.recommendation = data.recommendationKey;

          // console.log(this.listingBoard);
          // console.log(this.sector);
          // console.log(this.recommendation);
        },
        error: (error) => console.error(error),
        complete: () => console.log('complete'),
      });
  }

  limitDisplayedData() {
    const beginningPage = (this.currentPage - 1) * this.limit;
    this.limitedData = this.data.slice(
      beginningPage,
      beginningPage + this.limit
    );
    this.allStockService.setLimit(this.limit);
    this.allStockService.setCurrentPage(this.currentPage);
    this.totalPage = Math.ceil(this.chosenItems / this.limit);
    this.allStockService.setTotalPage(this.totalPage);

    // console.log('limit: ' + this.limit);
    // console.log('limited data: ', JSON.stringify(this.limitedData, null, 2));
    // console.log('current page: ' + this.currentPage);
    // console.log('total page' + this.totalPage);
  }

  receiveChangeListingBoard(event: string) {
    this.currentListingBoard =
      this.currentListingBoard === event ? undefined : event;
    this.getAllStock();
  }

  receiveChangeSector(event: string) {
    this.currentSector = this.currentSector === event ? undefined : event;
    this.getAllStock();
  }

  receiveChangeIndustry(event: string) {
    this.currentIndustry = this.currentIndustry === event ? undefined : event;
    this.getAllStock();
  }

  receiveChangeRecommendation(event: string) {
    this.currentRecommendation =
      this.currentRecommendation === event ? undefined : event;
    this.getAllStock();
  }

  receiveChangeMinMarketCap(min: number | undefined) {
    this.currentMinMarketCap = min;
    this.getAllStock();
  }

  receiveChangeMaxMarketCap(max: number | undefined) {
    this.currentMaxMarketCap = max;
    this.getAllStock();
  }

  receiveChangeMinPrice(min: number | undefined) {
    this.currentMinPrice = min;
    this.getAllStock();
  }

  receiveChangeMaxPrice(max: number | undefined) {
    this.currentMaxPrice = max;
    this.getAllStock();
  }

  receiveChangeMinDividendRate(min: number | undefined) {
    this.currentMinDividendRate = min;
    this.getAllStock();
  }

  receiveChangeMaxDividendRate(max: number | undefined) {
    this.currentMaxDividendRate = max;
    this.getAllStock();
  }

  receiveChangeSortBy(sortBy: string | undefined) {
    this.currentSortBy = sortBy;
    this.getAllStock();
  }

  receiveChangeOrder(order: string | undefined) {
    this.currentOrder = order;
    this.getAllStock();
  }

  
}
