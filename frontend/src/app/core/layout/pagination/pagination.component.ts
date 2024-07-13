import { Component, Input, input } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AllStockService } from '../../../features/all-stocks-service/all-stock.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [DashboardComponent, NgClass, NgFor, NgIf],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  totalPage: number = 0;
  currentPage: number = 0;
  limit: number = 0;

  // totalPage = this.allStockService.getTotalPage();
  // currentPage = this.allStockService.getCurrentPage();
  // limit = this.allStockService.getLimit();
  pagesToShow: number[] = [];

  constructor(private allStockService: AllStockService) {}

  ngOnInit(): void {
    combineLatest([
      this.allStockService.totalPage$,
      this.allStockService.currentPage$,
      this.allStockService.limit$]).
      subscribe(([totalPage, currentPage, limit]) => {
        this.totalPage=totalPage;
        this.currentPage = currentPage;
        this.limit=limit;
        this.showPages();

        console.log("currentpage pagination " + this.currentPage);
        console.log("totalPage pagination " + this.totalPage);
        console.log("limit pagination " + this.limit);
    
      })
    
    // this.allStockService.totalPage$.subscribe((totalPage) => {
    //   this.totalPage = totalPage;
    //   this.showPages();
    // }); //berarti di setiap ngonit, dia harus pake observable yang disubscribe biar dia auto update
    // this.allStockService.currentPage$.subscribe((currentPage) => {
    //   this.currentPage = currentPage;
    //   this.showPages();
    // });



    //ambil data yang akan ditampilkan di pagination
    // this.currentPage = this.allStockService.getCurrentPage();
    // this.totalPage = this.allStockService.getTotalPage();
    // this.limit = this.allStockService.getLimit()
    
    // console.log("currentpage pagination " + this.currentPage);
    // console.log("totalPage pagination " + this.totalPage);
    // console.log("limit pagination " + this.limit);
    // this.showPages()


    //trus subscribe ke perubahan yang disimpan di allstockservice
    // this.allStockService.currentPage$.subscribe((currentPage) => {
    //   this.currentPage = currentPage
    //   console.log("currentpage pagination " + this.currentPage);

    // } )
    // this.allStockService.totalPage$.subscribe((totalPage) => {
    //   this.totalPage = totalPage
    //   console.log("totalPage pagination " + this.totalPage);

    // })
    // this.allStockService.limit$.subscribe((limit) => {
    //   this.limit = limit
    //   console.log("limit pagination " + this.limit);

    // })

    // console.log("limit pagination " + this.limit);
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.allStockService.setCurrentPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPage) {
      this.allStockService.setCurrentPage(this.currentPage + 1);
    }
  }

  changePage(page: number): void {
    this.allStockService.setCurrentPage(page);
  }

  // setCurrentPageStyle(){
  //   this.currentPage = {
      
  //   'background-color': this.currentPage =  hsl(171, 100%, 41%)	; 
  //   'color': #000; 
  // }
  // }

  showPages(): void {
    this.pagesToShow = [];

    if (this.currentPage > 1){
      this.pagesToShow.push(this.currentPage-1)
    } else {
      this.pagesToShow.push(this.currentPage+2)
    }

    this.pagesToShow.push(this.currentPage)

    if (this.currentPage<this.totalPage){
      this.pagesToShow.push(this.currentPage+1)
    } else {
      this.pagesToShow.push(this.currentPage-2)
    }

    this.pagesToShow.sort((a,b) => a-b)
    console.log("this.pagesToShow"+this.pagesToShow);
    
    
  }
}
