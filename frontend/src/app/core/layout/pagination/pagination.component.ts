import { Component } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AllStockService } from '../../../features/all-stocks-service/all-stock.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [DashboardComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  totalPage = this.allStockService.getTotalPage();

  constructor(private allStockService: AllStockService) {}

  previousPage(): void {
    const currentPage = this.allStockService.getCurrentPage(); //habis di set di ambil di sini, untuk mengambil tampilan info nya
    if (currentPage > 1) {
      this.allStockService.setCurrentPage(currentPage - 1);
    }
  }

  nextPage(): void {
    const currentPage = this.allStockService.getCurrentPage();
    if (currentPage < this.totalPage) {
      this.allStockService.setCurrentPage(currentPage + 1);
    }
  }

  changePage(page: number): void {
    this.allStockService.setCurrentPage(page);
  }
}
