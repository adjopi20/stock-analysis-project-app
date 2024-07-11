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
  currentPage: number = 1;
  itemsPerPage: number = 12;
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
    this.getAllStock();
  }

  getAllStock() {
    this.isLoading = true;
    this.apiService
      .getStockList()
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          this.hasError = true;
          return [];
        })
      )
      .subscribe((data: any) => {
        this.data = data.data;
        this.total = data.total;
        this.itemsPerPage = data.itemPerPage;
        this.allStockService.setCurrentPage(data.currentPage); //berarti di awal di set disini untuk ngatur respon card nya
        this.allStockService.setTotalPage(data.totalPage);
        this.chosenItems = data.totalChosenItems;
        this.isLoading = false;
        this.hasError = false;
        this.isLogin = false;
      });
  }
}
