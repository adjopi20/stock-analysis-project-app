import {
  DatePipe,
  getLocaleFirstDayOfWeek,
  NgFor,
  NgIf,
} from '@angular/common';
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
  weeklyGainers: any[] = [];
  monthlyGainers: any[] = [];
  topLosers: any[] = [];
  topDividends: any[] = [];
  topEarnings: any[] = [];
  topMarketCaps: any[] = [];
  latestPrice: any = {};

  constructor(
    private apiService: FlaskApiService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getHistoricalPrice();
  }

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

  async getHistoricalPrice() {
    try {
      const data = await firstValueFrom(
        this.apiService.getHistoricalPrice('1mo')
      );
      this.stocks = data;
      console.log('this.stocks', this.stocks);
      this.topGainerss();
    } catch (error: any) {
      console.log(error);
    } finally {
      console.log('complete');
    }
  }

  // this.stocks.sort((a, b) => b.marketCap - a.marketCap);
  // this.topDividends = this.stocks
  //   .filter((item) => item.dividendRate)
  //   .sort((a, b) => b.dividendRate - a.dividendRate)
  //   .slice(0, 10);
  // this.topMarketCaps = this.stocks
  //   .filter((item) => item.marketCap)
  //   .sort((a, b) => b.marketCap - a.marketCap)
  //   .slice(0, 10);

  topGainerss() {
    for (let item of this.stocks) {
      // if (item.metadata.symbol === 'AALI.JK') {
      const close = item.history.Close;
      const dates = Object.keys(close);
      const latest = dates[dates.length - 1];
      const latestPrice = close[latest];
      const start = dates[dates.length - 3];
      const startPrice = close[start];
      const end = dates[dates.length - 2];
      const endPrice = close[end];

      const percentChange = (
        ((endPrice - startPrice) / startPrice) *
        100
      ).toFixed(2);

      const tes = {
        symbol: item.metadata.symbol,
        price: latestPrice,
        percentChange: percentChange,
      };
      this.topGainers.push(tes);
    }

    this.topGainers.sort((a, b) => b.percentChange - a.percentChange)
    this.topGainers = this.topGainers.slice(0, 10);
    console.log("this.topGainers",this.topGainers);
    
    // this.latestPrice = {
    //   latestPrice: latestPrice,
    // };
    // }
  }

  // const today: Date = new Date();
  // const oneDay: number = 24*60*60*1000;
  // const startDate= new Date(today.getTime()-oneDay*2);
  // const endDate = new Date(today.getTime()-oneDay);
  // const start = this.datePipe.transform(startDate, 'yyyy-MM-dd');
  // const end = this.datePipe.transform(endDate, 'yyyy-MM-dd');

  WeeklyGainers(symbol: string, period: string, start: string, end: string) {}

  MonthlyGainers(symbol: string, period: string, start: string, end: string) {}
}
