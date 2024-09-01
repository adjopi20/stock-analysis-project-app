import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FlaskApiService } from '../../../features/flask-api-service/flask-api.service';
import { SearchDirective } from '../../../shared/directive/search-directive/search.directive';
import { SearchPipe } from '../../../shared/pipe/search-pipe/search.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { ClickOutsideDirective } from '../../../shared/directive/click-outside-directive/click-outside.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    // BrowserModule,
    FormsModule,
    NgFor,
    SearchDirective,
    SearchPipe,
    NgIf,
    ClickOutsideDirective,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  searchText: string = '';
  title: string = 'angular-text-search-highlight';
  filteredData: any[] = [];
  data: any[] = []; // Your original data array
  showDropdown: boolean = false;

  constructor(private apiService: FlaskApiService, private router: Router, private cdr:ChangeDetectorRef) {}

  ngOnInit() {
    this.getStocks();
    this.onSearchInput();
  }

  async getStocks() {
    try {
      const response = await firstValueFrom(this.apiService.getStockList());
      this.data = response.data;
      console.log('navbar data1', this.data);

      // this.filteredData = [...this.data];
      // for (const item of data1) {
      //   this.data.push(item);
      // }
      console.log('navbar data2', this.data);
      console.log('navbar filteredData', this.filteredData);
    } catch (error) {
      console.error('nav', error);
    } finally {
      console.log('complete');
    }
  }

  onSearchInput() {
    if (this.searchText.trim() === '') {
      this.filteredData = [];
      this.showDropdown = false;
    } else {
      const query = this.searchText.toLowerCase();
      this.filteredData = this.data.filter(
        (stock) =>
          stock.company_name.toLowerCase().includes(query) ||
          stock.symbol.toLowerCase().includes(query)
      );
      // this.showDropdown = this.filteredData.length > 0;
      this.showDropdown = true;
      console.log('filteredData', this.filteredData);
      this.cdr.detectChanges();
      
    }

  }

  selectStock(stock: any) {
    // this.searchText = `${stock.company_name} (${stock.symbol})`;
    this.showDropdown = false;
    // Navigate to the stock details page
    this.router.navigate(['/stock', stock.symbol]);
    this.searchText = ''; // Clear the search input
  }

  clickOutsideSearchBar() {
    this.showDropdown = false;
    this.searchText = '';
  }

  
}
