import { Component } from '@angular/core';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-stock-page',
  standalone: true,
  imports: [],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.scss',
})
export class StockPageComponent {
  symbol: string = 'bbca.jk';
  stockInfo: any = {};
  name: string = '';

  constructor(
    private apiService: FlaskApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.symbol = params.get('symbol') || '';
      // console.log('Symbol from URL:', this.symbol); // Check if this logs correctly
      this.getStockInfo();
      this.getStockFinancials();
      this.getStockHistoricalData('1y');
    });
    // console.log('Symbol from URL:', this.symbol);
    // this.getStockInfo();
    // this.getStockFinancials();
    // this.getStockHistoricalData('1y');
  }

  async getStockInfo() {
    try {
      // this.stockInfo = await firstValueFrom(
      //   this.apiService.getStockInfo(this.symbol)
      // );
      const data = await firstValueFrom(
        this.apiService.getStockList()
      )
      const stocklistData = data.data

      console.log('stocklist data', stocklistData);
      
      for (let item of stocklistData) {
        if (item.symbol.toLowerCase() === this.symbol.toLowerCase()) {
          this.stockInfo = item;
          break;
        }
      }
       
      this.name = this.stockInfo.company_name;
      console.log('stck info', this.stockInfo);
      console.log('name', this.name);
    } catch (err) {
      console.log(err);
    } finally {
      console.log('completed');
    }
  }

  async getStockFinancials() {
    const balSheet = await firstValueFrom(
      this.apiService.getQBalSheet(this.symbol)
    );
    const cashFlow = await firstValueFrom(
      this.apiService.getQCashFlow(this.symbol)
    );
    const incomeStmt = await firstValueFrom(
      this.apiService.getQIncomeStatement(this.symbol)
    );
  }

  async getStockHistoricalData(period: string) {
    const data = await firstValueFrom(
      this.apiService.getStockHistoricalData(this.symbol, period)
    );
  }

  async getStockHolders() {}
}
