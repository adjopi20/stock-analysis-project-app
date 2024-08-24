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
import { PieChartComponent } from "../../../shared/component/pie-chart/pie-chart.component";

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
    PieChartComponent
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
  holdersChart: any[] = [];
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
          const dataTable = this.convertToPieChart(this.stockInfo)
          const title = `Holders Percentage of ${this.symbol}`
          this.holdersChart.push({ title, dataTable });
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
    }); 

    this.cdr.detectChanges();
    console.log('datatable: ', dataTable);

    return dataTable;
  }

  convertToPieChart(data: any){
    let dataTable: [string , any][] = [];
    dataTable.push(['Holder', 'Percent Held']);


    const heldPercentInsiders = data.heldPercentInsiders;
    const heldPercentInstitutions = data.heldPercentInstitutions;
    const others = 1 - (heldPercentInsiders+heldPercentInstitutions);
    dataTable.push(['Insiders', heldPercentInsiders]);
    dataTable.push(['Institutions', heldPercentInstitutions]);
    dataTable.push(['Others', others]); 

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
  
}
