import { Component, Self, SkipSelf } from '@angular/core';
import { FlaskApiService } from '../../../features/flask-api-service/flask-api.service';
import { AllStockService } from '../../../features/all-stocks-service/all-stock.service';
import { CommonModule, NgFor } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { Perform } from '../../../shared/class/perform-class/perform';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FilterContainerComponent } from "../filter-container/filter-container.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgFor,
    JsonPipe,
    SideNavComponent,
    CommonModule,
    PaginationComponent,
    FilterContainerComponent,
    
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  // data = new Perform<[]>(); //jangan lupa sertakan <> untuk menspesifikkan output/keluaran fungsi kek di java kan "public dtype namafungsi(dtype parameter)"
  data: any[] = [];
  sector: any[] = [];
  industry: any[] = [];
  listingBoard: any[] = [];
  total: number = 0;
  currentPage: number = 1;
  limit: number = 0;
  totalPage: number = 0;
  chosenItems: number = 0;

  isLoading: boolean = false;
  hasError: boolean = false;
  isLogin: boolean = false;
  isFilteredBySector: boolean = false;
  isFilteredByIndustry: boolean = false;

  constructor(
    @SkipSelf() private apiService: FlaskApiService,
    private allStockService: AllStockService
  ) {}

  ngOnInit() {

    this.allStockService.currentPage$.subscribe((currentPage) => {
      if (this.currentPage !== currentPage) {
        this.currentPage = currentPage;
        this.getAllStock(this.currentPage, this.limit);
      }
      console.log("Current page after subscription: " + this.currentPage);
    } )

    this.allStockService.totalPage$.subscribe((totalPage) => {
      // if (totalPage !== this.totalPage){
      this.totalPage = totalPage;
    //   this.getAllStock(this.currentPage, this.limit)
    // }
      console.log("totalPage d aft subs " + this.totalPage);
    })

    this.allStockService.total$.subscribe((total) => {
      this.total = total;
      console.log("totalPage d aft subs " + this.totalPage);
    })


    this.allStockService.limit$.subscribe((limit) => {
      if (this.limit !== limit) {
        this.limit = limit;
        this.getAllStock(this.currentPage, this.limit);
      }
      console.log("Limit after subscription: " + this.limit);
    })

    
     // Initial fetch
     this.getAllStock(this.currentPage, this.limit);

  }

  getAllStock(
    page?: number, limit?: number
  ) {
    this.isLoading = true;
    this.apiService
      .getStockList(
        page, limit
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
        this.currentPage = data.currentPage;
        this.allStockService.setCurrentPage(this.currentPage)
        
        this.data = data.data;
        
        this.limit = data.limit;
        this.allStockService.setLimit(this.limit)
        
        this.total = data.total;
        this.allStockService.setTotal(this.total)

        this.chosenItems = data.totalChosenItems;
        
        this.totalPage = data.totalPage; //get total page dari api
        this.allStockService.setTotalPage(this.totalPage) //set total page ke pagination component
        
        this.isLoading = false;
        this.hasError = false;
        this.isLogin = false;

        this.sector = [...new Set(this.data.map(item => item.sector))];  
        this.listingBoard = [...new Set(this.data.map(item => item.listing_board))];  
        this.industry = [...new Set(this.data.map(item => item.industry))];  
        console.log(this.industry);
        console.log(this.listingBoard);
        
        


        console.log('Current Page Dashboard:', this.currentPage);
        console.log('Data Dashboard:',  this.data.length);
        console.log('Limit Dashboard:', this.limit);
        console.log('Total Dashboard:', this.total);
        console.log('Chosen Items Dashboard:', this.chosenItems);
        console.log('Total Page Dashboard:', this.totalPage);

        });
  }

  
  
}
