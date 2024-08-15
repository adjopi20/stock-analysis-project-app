import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NewsComponent } from '../news/news.component';
import { CarouselComponent } from '../../../shared/component/carousel/carousel.component';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [NgFor, NgIf, NewsComponent, CarouselComponent],
  providers: [DatePipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  stocks: any[] = [];
  topGainers: any[] = [];
  topLosers: any[] = [];
  topDividends: any[] = [];
  topEarnings: any[] = [];
  topMarketCaps: any[] = [];
  
  constructor(private apiService: FlaskApiService, private datePipe: DatePipe) {}

  async getStocks() {
    try {
      const data = await firstValueFrom(this.apiService.getStockList());
      this.stocks = data.data;
      this.stocks.sort((a, b) => b.marketCap - a.marketCap);
      this.topDividends = this.stocks
        .filter((item) => item.dividendRate)
        .sort((a, b) => b.dividendRate - a.dividendRate)
        .slice(0, 10);
      this.topMarketCaps = this.stocks
        .filter((item) => item.marketCap)
        .sort((a, b) => b.marketCap - a.marketCap)
        .slice(0, 10);
    } catch (error: any) {
      console.log(error);
    } finally {
      console.log('complete');
    }
  }

  async getHistoricalPrice(period: string, start: string, end: string ) {
    try {
      const data = await firstValueFrom(this.apiService.getHistoricalPrice(period, start, end));
      this.stocks = data.data;
      this.stocks.sort((a, b) => b.marketCap - a.marketCap);
      this.topDividends = this.stocks
        .filter((item) => item.dividendRate)
        .sort((a, b) => b.dividendRate - a.dividendRate)
        .slice(0, 10);
      this.topMarketCaps = this.stocks
        .filter((item) => item.marketCap)
        .sort((a, b) => b.marketCap - a.marketCap)
        .slice(0, 10);
    } catch (error: any) {
      console.log(error);
    } finally {
      console.log('complete');
    }
  }

  // dateToString 

  topGainerss(period: string){ 
    const today: Date = new Date();
    const oneDay: number = 24*60*60*1000;
    const startDate= new Date(today.getTime()-oneDay*2);
    const endDate = new Date(today.getTime()-oneDay);  
    const start = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    const end = this.datePipe.transform(endDate, 'yyyy-MM-dd');
  }

  weeklyGainers(symbol: string, period: string, start: string, end: string){ 

  }

  MonthlyGainers(symbol: string, period: string, start: string, end: string){ 

  }
}
