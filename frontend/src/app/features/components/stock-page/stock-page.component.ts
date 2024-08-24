import { ChangeDetectorRef, Component } from '@angular/core';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  CurrencyPipe,
  DecimalPipe,
  NgClass,
  NgFor,
  PercentPipe,
} from '@angular/common';
import { LineChartComponent } from '../../../shared/component/line-chart/line-chart.component';
import { ListingBoardService } from '../../../shared/service/listingBoardService/listing-board.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-stock-page',
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    CurrencyPipe,
    DecimalPipe,
    LineChartComponent,
    PercentPipe,
  ],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.scss',
})
export class StockPageComponent {
  symbol: string = '';
  stockInfo: any = {};
  name: string = '';
  companyOfficers: any[] = [];
  rawData: any[] = [];
  priceChart: any[] = [];
  pricePeriod: string = '';
  percentChange: number = 0;
  currentPeriod: string = '1mo';
  priceData: any;
  

  constructor(
    private apiService: FlaskApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    protected lbs: ListingBoardService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.symbol = params.get('symbol') || '';
      // console.log('Symbol from URL:', this.symbol); // Check if this logs correctly
      this.getStockInfo();
      this.getStockFinancials();
      this.getStockHistorical(this.currentPeriod);
      // this.getStockHistoricalData('1y');
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
      const data = await firstValueFrom(this.apiService.getStockList());
      const stocklistData = data.data;

      console.log('stocklist data', stocklistData);

      for (let item of stocklistData) {
        if (item.symbol.toLowerCase() === this.symbol.toLowerCase()) {
          this.stockInfo = item;
          this.companyOfficers = item.companyOfficers;
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

  async getStockHistorical(period: string) {
    console.log('symbol tes: ', this.symbol);

    const data = await firstValueFrom(
      this.apiService.getStockHistoricalData(this.symbol, period)
    );

    console.log('data tes: ', data);

    // Check if data is available
    if (data) {
      const title = `Price of ${this.symbol} for ${period}`;
      const dataTable = this.convertToLineChart(data);
      this.priceChart.push({ title, dataTable });
      console.log('price chart: ', this.priceChart);

      this.percentChanges(data);
    } else {
      console.log(`No data returned for symbol: ${this.symbol};
      }`);
    }
    this.cdr.detectChanges();
  }

  convertToLineChart(data: any) {
    // Initialize with header row
    const dataTable = [['Period', 'Price']];

    Object.keys(data.history.Close).forEach((period) => {
      const date = new Date(period);
      const price = data.history.Close[period];
      dataTable.push([date, price]);
    }); //lebih keren ini karena udah disiapkan iterasi untuk object data

    // for (let [keys, values] of Object.entries(data.history.Close)) {
    //   const date = new Date(keys);
    //   const price = data.history.Close[keys];
    //   dataTable.push([date, price]);
    // }

    this.cdr.detectChanges();
    console.log('datatable: ', dataTable);

    return dataTable;
  }

  percentChanges(item: any) {
    const close = item.history.Close;
    const dates = Object.keys(close);

    const endDate = dates[dates.length - 1];
    const endPrice = close[endDate];
    const startDate = dates[1];
    const startPrice = close[startDate];
    this.percentChange = (endPrice - startPrice) / startPrice;
    console.log('percent change: ', this.percentChange);
  }

  onPeriodChange(event: any) {
    this.currentPeriod = event.target.value;
    this.priceChart = [];
    this.getStockHistorical(this.currentPeriod);  
  }
  // for (let item of this.stocks) {
  //   const close = item.history.Close;
  //   const volumes = item.history.Volume;
  //   const dates = Object.keys(close);
  //   const latest = dates[dates.length - 1];
  //   const latestPrice = close[latest];
  //   const start = dates[dates.length - 3];
  //   const startPrice = close[start];
  //   const end = dates[dates.length - 2];
  //   const endPrice = close[end];
  //   const volume = volumes[end];
  //   const companyName = item.metadata.longName;
  //   // if (item.metadata.symbol.toLowerCase() === )

  //   const percentChange = (
  //     ((endPrice - startPrice) / startPrice) *
  //     100
  //   ).toFixed(2);

  //   const tes = {
  //     symbol: item.metadata.symbol,
  //     companyName: companyName,
  //     price: latestPrice,
  //     percentChange: percentChange,
  //     lastDayVolume: volume,
  //   };
  //   list.push(tes);
  // }
  // const sortedPercentChange = list.sort(
  //   (a: any, b: any) => b.percentChange - a.percentChange
  // );
  // this.topGainers = sortedPercentChange.slice(0, 10);
  // this.topLosers = sortedPercentChange.slice(list.length - 10, list.length);

  // const sortedVolume = list.sort((a: any, b: any) => b.lastDayVolume - a.lastDayVolume);
  // this.topVolumes = sortedVolume.slice(0, 12);
}
