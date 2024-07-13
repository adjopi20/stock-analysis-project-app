import { Component } from '@angular/core';
import { FlaskApiService } from '../../../features/flask-api-service/flask-api.service';
import { AllStockService } from '../../../features/all-stocks-service/all-stock.service';
import { CommonModule, NgFor } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { Perform } from '../../../shared/class/perform-class/perform';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgFor,
    JsonPipe,
    SideNavComponent,
    CommonModule,
    PaginationComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  // data = new Perform<[]>(); //jangan lupa sertakan <> untuk menspesifikkan output/keluaran fungsi kek di java kan "public dtype namafungsi(dtype parameter)"
  data: any[] = [];
  total: number = 0;
  currentPage: number = 0;
  limit: number = 0;
  totalPage: number = 0;
  chosenItems: number = 0;

  isLoading: boolean = false;
  hasError: boolean = false;
  isLogin: boolean = false;
  isFilteredBySector: boolean = false;
  isFilteredByIndustry: boolean = false;

  constructor(
    private apiService: FlaskApiService,
    private allStockService: AllStockService
  ) {}

  ngOnInit() {
    // this.data.load(this.service.getStockList())
    // console.log(this.data.load(this.service.getStockList()))
    // this.currentPage = this.allStockService.getCurrentPage();
    // this.limit = this.allStockService.getLimit();
    // this.total = this.allStockService.getTotalPage();
    // this.getAllStock(this.currentPage, this.itemsPerPage);
    // Subscribe to changes in currentPage$ and fetch new data
    // this.allStockService.currentPage$.subscribe((currentPage) => {
    //   this.currentPage = currentPage;
    //   this.getAllStock(this.currentPage, this.itemsPerPage);
    // });
    // console.log(this.currentPage);

    // get dulu dari allstock service, trus set ke metod yang akan dikirim ke apiservice
    // this.currentPage = this.allStockService.getCurrentPage();
    // this.limit= this.allStockService.getLimit();
    

    //trus subscribe juga ke perubahan yang didapat dari pagination service, apabila kita melakukan click di pagination component -> allstockswervice -> dashboard
    // this.allStockService.currentPage$.subscribe((currentPage) =>
    //   this.getAllStock(
    //     // currentPage, this.limit
    //   )
    // );
    // this.allStockService.limit$.subscribe((limit) =>
    //   this.getAllStock(
    //     // this.currentPage, limit
    //   )
    // );
    // this.allStockService.totalPage$.subscribe((totalPage) => {
    //   this.totalPage = totalPage;
    // })
    this.getAllStock(
      // this.currentPage, this.limit
    );

    //trus subscribe ke perubahan yang disimpan di allstockservice
    this.allStockService.currentPage$.subscribe((currentPage) => {
      this.currentPage = currentPage
      console.log("currentpage d aft subs " + this.currentPage);

    } )
    this.allStockService.totalPage$.subscribe((totalPage) => {
      this.totalPage = totalPage
      console.log("totalPage d aft subs " + this.totalPage);

    })
    this.allStockService.limit$.subscribe((limit) => {
      this.limit = limit
      console.log("limit d aft subs " + this.limit);})

    
    

  }

  getAllStock(
    // page?: number, limit?: number
  ) {
    this.isLoading = true;
    this.apiService
      .getStockList(
        // page, limit
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
        
        this.limit = data.itemPerPage;
        this.allStockService.setLimit(this.limit)
        
        this.total = data.total;
        this.chosenItems = data.totalChosenItems;
        
        this.totalPage = data.totalPage; //get total page dari api
        this.allStockService.setTotalPage(this.totalPage) //set total page ke pagination component
        // this.allStockService.setCurrentPage(data.currentPage);
        // this.allStockService.setLimit(data.itemPerPage);
        // this.allStockService.setTotalPage(data.totalPage);
        this.isLoading = false;
        this.hasError = false;
        this.isLogin = false;

        console.log('Current Page Dashboard:', this.currentPage);
        console.log('Data Dashboard:',  this.data.length);
        console.log('Limit Dashboard:', this.limit);
        console.log('Total Dashboard:', this.total);
        console.log('Chosen Items Dashboard:', this.chosenItems);
        console.log('Total Page Dashboard:', this.totalPage);

        //update itemsperpage dan currentPage di allstock service yang nantinya akan dipanggil ke pagination component
        // this.allStockService.setLimit(this.itemsPerPage);
        // this.allStockService.setCurrentPage(this.currentPage);
      });
  }
}
