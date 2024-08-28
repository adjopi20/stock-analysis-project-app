import { ChangeDetectorRef, Component } from '@angular/core';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { firstValueFrom, skip } from 'rxjs';
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
import { PieChartComponent } from '../../../shared/component/pie-chart/pie-chart.component';
import { ColumnChartComponent } from '../../../shared/component/column-chart/column-chart.component';
import { Title } from '@angular/platform-browser';
import { FinancialsComponent } from '../financials/financials.component';
import { FinancialsService } from '../../../shared/service/financials/financials.service';

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
    PieChartComponent,
    ColumnChartComponent,
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
  IncStmtChart: any[] = [];
  BalSheetChart: any[] = [];
  CashFlowChart: any[] = [];
  DividendsChart: any[] = [];
  StockSplitsChart: any[] = [];
  pricePeriod: string = '';
  percentChange: number = 0;
  currentPeriod: string = '1mo';
  finPeriod: string = 'quarterly';
  priceData: any;

  constructor(
    private apiService: FlaskApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    protected lbs: ListingBoardService,
    private fs: FinancialsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.symbol = params.get('symbol') || '';
      this.getStockInfo();
      this.getStockHistorical(this.currentPeriod);
      this.getStockActions();

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
          this.name = this.stockInfo.company_name;
          this.companyOfficers = item.companyOfficers;
          const dataTable = this.convertToPieChart(this.stockInfo);
          const title = `Holders Percentage of ${this.name}`;
          this.holdersChart.push({ title, dataTable });
          break;
        }
      }

      console.log('stck info', this.stockInfo);
      console.log('name', this.name);
      this.getStockFinancials();
    } catch (err) {
      console.log(err);
    } finally {
      console.log('completed');
    }
  }

  async getStockFinancials() {
    this.getIncomeStatement();
    this.getCashFlow();
    this.getBalSheet();
  }

  async getStockHistorical(period: string) {
    console.log('symbol tes: ', this.symbol);

    const data = await firstValueFrom(
      this.apiService.getStockHistoricalData(this.symbol, period)
    );

    console.log('data tes: ', data);

    // Check if data is available
    if (data) {
      const title = `Price of ${this.name} for ${period}`;
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

  convertToPieChart(data: any) {
    let dataTable: [string, any][] = [];
    dataTable.push(['Holder', 'Percent Held']);

    const heldPercentInsiders =
      data.heldPercentInsiders === 0 ? skip : data.heldPercentInsiders;
    const heldPercentInstitutions = data.heldPercentInstitutions;
    const others = 1 - (heldPercentInsiders + heldPercentInstitutions);
    if (heldPercentInsiders !== 0) {
      dataTable.push(['Insiders', heldPercentInsiders]);
    }
    if (heldPercentInstitutions !== 0) {
      dataTable.push(['Institutions', heldPercentInstitutions]);
    }
    if (others !== 0) {
      dataTable.push(['Others', others]);
    }

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

  onFinancialPeriodChange(event: any) {
    this.finPeriod = event.target.value;
    console.log('financial period: ', this.finPeriod);

    this.IncStmtChart = [];
    this.BalSheetChart = [];
    this.CashFlowChart = [];
    this.getStockFinancials();
  }

  async getIncomeStatement() {
    try {
      // this.IncStmtChart = []; // Clear previous data
      let data: any = [];

      if (this.finPeriod === 'quarterly') {
        data = await firstValueFrom(
          this.apiService.getQIncomeStatement(this.symbol)
        );
      } else if (this.finPeriod === 'yearly') {
        data = await firstValueFrom(
          this.apiService.getIncomeStatement(this.symbol)
        );
      }

      console.log('Income Statement: ', data);

      if (data) {
        const title = `Income Statement`;
        const dataTable = this.fs.convertToChartIncStmt(data, this.symbol);
        this.IncStmtChart.push({ title, dataTable });
        console.log('data table: ', dataTable);
      } else {
        console.warn(`No data returned for symbol: ${this.name}`);
      }

      this.cdr.detectChanges();
    } catch (error) {
      console.error('get income statement error: ', error);
    } finally {
      console.log('complete');
    }
  }

  async getBalSheet() {
    let data: any = [];
    try {
      if (this.finPeriod === 'quarterly') {
        data = await firstValueFrom(this.apiService.getQBalSheet(this.symbol));
      } else {
        data = await firstValueFrom(this.apiService.getBalSheet(this.symbol));
      }

      // Check if data is available
      if (data) {
        const title = `Balance Sheet`;
        const dataTable = this.fs.convertToChartBalSh(data, this.symbol);
        this.BalSheetChart.push({ title, dataTable });
        console.log('data table: ', dataTable);
      } else {
        console.warn(`No data returned for symbol: ${this.name}`);
      }

      this.cdr.detectChanges();
    } catch (error) {
      console.warn('get bal sheet error: ', error);
    } finally {
      console.log('complete');
    }
  }

  async getCashFlow() {
    try {
      let data: any = [];

      // if (this.finPeriod === 'quarterly') {
      //   data = await firstValueFrom(
      //     this.apiService.getQCashFlow(this.symbol)
      //   );
      // } else if (this.finPeriod === 'yearly') {
      //   data = await firstValueFrom(
      //     this.apiService.getCashFlow(this.symbol)
      //   );
      // }

      data =
        this.finPeriod === 'quarterly'
          ? await firstValueFrom(this.apiService.getQCashFlow(this.symbol))
          : (data = await firstValueFrom(
              this.apiService.getCashFlow(this.symbol)
            ));

      // Check if data is available
      if (data) {
        const title = `Cash Flow`;
        console.log('name:: ', this.name);

        const dataTable = this.fs.convertToChartCashFlow(data, this.symbol);
        this.CashFlowChart.push({ title, dataTable });
        console.log('data table: ', dataTable);
      } else {
        console.warn(`No data returned for symbol: ${this.name}`);
      }

      this.cdr.detectChanges();
    } catch (error) {
      console.log('get income statement error: ', error);
    } finally {
      console.log('complete');
    }
  }

  async getStockActions() {
    try {
      const data = await firstValueFrom(
        this.apiService.getStockAction(this.symbol)
      );

      const dividends = data.Dividends;
      const stockSplit = data['Stock Splits'] || {}; // Default to an empty object if undefined

      if (dividends) {
        const title = `Dividends`;
        const dataTable = this.convertToBarChartDividends(dividends);
        this.DividendsChart.push({ title, dataTable });
        console.log('data table: ', dataTable);
      } else {
        console.warn(`No dividend returned for symbol: ${this.name}`);
      }
      if (stockSplit) {
        const title = `Stock Splits`;
        const dataTable = this.convertToBarChartStockSplits(stockSplit);
        this.StockSplitsChart.push({ title, dataTable });
        console.log('stock split: ', dataTable);
      } else {
        console.warn(`No stock split returned for symbol: ${this.name}`);
      }

      this.cdr.detectChanges();
    } catch (error) {
      console.log('get bal sheet error: ', error);
    } finally {
      console.log('complete');
    }
  }

  convertToBarChartDividends(data: any) {
    const dataTable = [['Period', 'Dividends']];
    Object.keys(data).forEach((period: any) => {
      const datePeriod = new Date(period); // Convert date to timestamp
      const dividends = data[period] ?? 0;
      dataTable.push([datePeriod, dividends]);
    });
    this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);
    return dataTable;
  }

  convertToBarChartStockSplits(
    // stockSplit: Record<string, number>
    data: any
  ) {
    const dataTable = [['Period', 'Stock Split']];
    Object.keys(data).forEach((period: any) => {
      const datePeriod = new Date(period); // Convert date to timestamp
      const stockSplit = data[period] ?? 0;

      if (stockSplit !== 0) {
        dataTable.push([datePeriod, stockSplit]);
      }
    });

    this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);

    return dataTable;
  }
}
