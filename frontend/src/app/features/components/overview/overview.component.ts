import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  getLocaleFirstDayOfWeek,
  KeyValuePipe,
  NgFor,
  NgIf,
  PercentPipe,
} from '@angular/common';
import { Component } from '@angular/core';
import { NewsComponent } from '../news/news.component';
import { CarouselComponent } from '../../../shared/component/carousel/carousel.component';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { firstValueFrom } from 'rxjs';
import { LoadingServiceService } from '../../../shared/service/loadingService/loading-service.service';
import { LoadingIndicatorComponent } from '../../../shared/component/loading-indicator/loading-indicator.component';
import { LoadingComponent } from '../../../shared/component/loading/loading.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NewsComponent,
    CarouselComponent,
    PercentPipe,
    CurrencyPipe,
    DecimalPipe,
    LoadingIndicatorComponent,
    LoadingComponent,
    RouterLink,
  ],
  providers: [DatePipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  stocks: any[] = [];
  topGainers: any[] = [];
  weeklyGainers: any[] = [];
  weeklyLosers: any[] = [];
  monthlyGainers: any[] = [];
  monthlyLosers: any[] = [];
  topLosers: any[] = [];
  topDividendRate: any[] = [];
  topDividendYield: any[] = [];
  topEarnings: any[] = [];
  topMarketCaps: any[] = [];
  topVolumes: any[] = [];
  topEPS: any[] = [];
  topROE: any[] = [];
  topEarningsGrowth: any[] = [];
  latestPrice: any = {};
  isLoading: boolean = false;

  constructor(
    private apiService: FlaskApiService,
    private datePipe: DatePipe,
    private loadingService: LoadingServiceService,
    private router : Router
  ) {}

  ngOnInit() {
    this.getHistoricalPrice();
    this.getStocks();
  }

  async getStocks() {
    try {
      this.loadingService.loadingOn();
      this.isLoading = true;

      const data = await firstValueFrom(this.apiService.getStockList());
      this.stocks = data.data;
      console.log('stocks2', this.stocks);

      this.stocks.sort((a, b) => b.marketCap - a.marketCap);
      this.topDividendRate = this.stocks
        .filter((item) => item.dividendRate)
        .sort((a, b) => b.dividendRate - a.dividendRate)
        .slice(0, 12);
      this.topDividendYield = this.stocks
        .filter((item) => item.dividendYield)
        .sort((a, b) => b.dividendYield - a.dividendYield)
        .slice(0, 12);
      this.topMarketCaps = this.stocks
        .filter((item) => item.marketCap)
        .sort((a, b) => b.marketCap - a.marketCap)
        .slice(0, 12);
      this.topEPS = this.stocks
        .filter((item) => item.trailingEps)
        .sort((a, b) => b.trailingEps - a.trailingEps)
        .slice(0, 12);
      this.topROE = this.stocks
        .filter((item) => item.returnOnEquity)
        .sort((a, b) => b.returnOnEquity - a.returnOnEquity)
        .slice(0, 12);
      this.topEarningsGrowth = this.stocks
        .filter((item) => item.earningsGrowth)
        .sort((a, b) => b.earningsGrowth - a.earningsGrowth)
        .slice(0, 12);
    } catch (error: any) {
      console.log(error);
    } finally {
      console.log('complete');
      this.loadingService.loadingOff();
      this.isLoading = false;
    }
  }

  async getHistoricalPrice() {
    try {
      this.loadingService.loadingOn();
      this.isLoading = true;

      const data = await firstValueFrom(
        this.apiService.getHistoricalPrice('1mo')
      );
      this.stocks = data;
      this.topGainerss();
      this.WeeklyGainers();
      this.MonthlyGainers();
    } catch (error: any) {
      console.log(error);
    } finally {
      console.log('complete');
      this.loadingService.loadingOff();
      this.isLoading = false;
    }
  }

  topGainerss() {
    let list = [];
    console.log('Stocks:', this.stocks);

    for (let item of this.stocks) {
      const close = item.history.Close;
      const volumes = item.history.Volume;
      const dates = Object.keys(close);
      const latest = dates[dates.length - 1];
      const latestPrice = close[latest];
      const start = dates[dates.length - 3];
      const startPrice = close[start];
      const end = dates[dates.length - 2];
      const endPrice = close[end];
      const volume = volumes[end];
      const companyName = item.metadata.longName;
      // if (item.metadata.symbol.toLowerCase() === )

      const percentChange = (
        ((endPrice - startPrice) / startPrice) *
        100
      ).toFixed(2);

      const tes = {
        symbol: item.metadata.symbol,
        companyName: companyName,
        price: latestPrice,
        percentChange: percentChange,
        lastDayVolume: volume,
      };
      list.push(tes);
    }
    const sortedPercentChange = list.sort(
      (a: any, b: any) => b.percentChange - a.percentChange
    );
    this.topGainers = sortedPercentChange.slice(0, 10);
    this.topLosers = sortedPercentChange.slice(list.length - 10, list.length);

    const sortedVolume = list.sort(
      (a: any, b: any) => b.lastDayVolume - a.lastDayVolume
    );
    this.topVolumes = sortedVolume.slice(0, 12);
  }

  WeeklyGainers() {
    let list = [];

    for (let item of this.stocks) {
      const close = item.history.Close;
      const dates = Object.keys(close);
      const latest = dates[dates.length - 1];
      const latestPrice = close[latest];
      const start = dates[dates.length - 7];
      const startPrice = close[start];
      const end = dates[dates.length - 2];
      const endPrice = close[end];
      const companyName = item.metadata.longName;

      const percentChange = (
        ((endPrice - startPrice) / startPrice) *
        100
      ).toFixed(2);

      const tes = {
        symbol: item.metadata.symbol,
        companyName: companyName,
        price: latestPrice,
        percentChange: percentChange,
      };
      list.push(tes);
    }
    const sortedPercentChange = list.sort(
      (a: any, b: any) => b.percentChange - a.percentChange
    );
    this.weeklyGainers = sortedPercentChange.slice(0, 10);
    this.weeklyLosers = sortedPercentChange.slice(
      list.length - 10,
      list.length
    );
  }

  MonthlyGainers() {
    let list = [];

    for (let item of this.stocks) {
      const close = item.history.Close;
      const volumes = item.history.Volume;
      const dates = Object.keys(close);
      const latest = dates[dates.length - 1];
      const latestPrice = close[latest];
      const start = dates[1];
      const startPrice = close[start];
      const end = dates[dates.length - 2];
      const endPrice = close[end];
      const companyName = item.metadata.longName;

      const percentChange = (
        ((endPrice - startPrice) / startPrice) *
        100
      ).toFixed(2);

      const tes = {
        symbol: item.metadata.symbol,
        companyName: companyName,
        price: latestPrice,
        percentChange: percentChange,
      };
      list.push(tes);
    }
    const sortedPercentChange = list.sort(
      (a: any, b: any) => b.percentChange - a.percentChange
    );
    this.monthlyGainers = sortedPercentChange.slice(0, 10);
    this.monthlyLosers = sortedPercentChange.slice(
      list.length - 10,
      list.length
    );
  }

  selectStock(stock: any) {
    // this.searchText = `${stock.company_name} (${stock.symbol})`;
    // this.showDropdown = false;
    // Navigate to the stock details page
    this.router.navigate(['/stock', stock.symbol]);
    // this.searchText = ''; // Clear the search input
  }
}
