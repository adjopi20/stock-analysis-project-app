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
    ColumnChartComponent
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
      this.getIncomeStatement();
      this.getBalSheet();
      this.getCashFlow();
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

  async getIncomeStatement() {
    try {
      // this.IncStmtChart = []; // Clear previous data
      const data = await firstValueFrom(
        this.apiService.getQIncomeStatement(this.symbol)
      );

      console.log('Income Statement: ', data);
      

      if (data) {
        const title = `Income Statement`;
        const dataTable = this.convertToLineChartIncStmt(data);
        this.IncStmtChart.push({ title, dataTable })
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

  async getBalSheet() {
    try {
      const data = await firstValueFrom(
        this.apiService.getQBalSheet(this.symbol)
      );

      // Check if data is available
      if (data) {
        const title = `Balance Sheet`;
        const dataTable = this.convertToLineChartBalSh(data);
        this.BalSheetChart.push({ title, dataTable });
        console.log('data table: ', dataTable);
      } else {
        console.warn(`No data returned for symbol: ${this.name}`);
      }

      this.cdr.detectChanges();
    } catch (error) {
      console.log('get bal sheet error: ', error);
    } finally {
      console.log('complete');
    }
  }

  async getCashFlow() {
    try {
      const data = await firstValueFrom(
        this.apiService.getQCashFlow(this.symbol)
      );

      // Check if data is available
      if (data) {
        const title = `Cash Flow`;
        console.log('name:: ', this.name);
        
        const dataTable = this.convertToLineChartCashFlow(data);
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

  convertToLineChartIncStmt(data: any) {
    // Initialize with header row
    const dataTable = [
      [
        'Period',
        'Total Revenue',
        'Total Expenses',
        'Operating Revenue',
        'Operating Expense',
        'EBITDA',
        'Gross Profit',
        'Net Income',
        'Basic EPS',
      ],
    ];

    Object.keys(data.q_income_statement).forEach((period: any) => {
      const periodData = data.q_income_statement[period];
      const datePeriod = new Date(period); // Convert date to timestamp

      const totalRevenue = periodData['Total Revenue'] ?? 0;
      const totalExpense = periodData['Total Expenses'] ?? 0;
      const operatingRevenue = periodData['Operating Revenue'] ?? 0;
      const operatingExpense = periodData['Operating Expense'] ?? 0;
      const EBITDA = periodData['EBITDA'] ?? 0;
      const grossProfit = periodData['Gross Profit'] ?? 0;
      const netIncome = periodData['Net Income'] ?? 0;
      const basicEPS = periodData['Basic EPS'] ?? 0;

      dataTable.push([
        datePeriod,
        totalRevenue,
        totalExpense,
        operatingRevenue,
        operatingExpense,
        EBITDA,
        grossProfit,
        netIncome,
        basicEPS,
      ]);
    });
    this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);
    return dataTable;
  }

  convertToLineChartBalSh(data: any) {
    // Initialize with header row
    const dataTable = [
      [
        'Period',
        'Total Assets',
        'Total Debt',
        'Net Debt',
        'Working Capital',
        'Cash And Cash Equivalents',
        'Total Liabilities Net Minority Interest',
        'Total Equity Gross Minority Interest',
        'Stockholders Equity',
        'Retained Earnings',
      ],
    ];

    Object.keys(data.q_balance_sheet).forEach((period: any) => {
      const periodData = data.q_balance_sheet[period];
      const datePeriod = new Date(period); // Convert date to timestamp
      const totalAssets = periodData['Total Assets'] ?? 0;
      const totalDebt = periodData['Total Debt'] ?? 0;
      const netDebt = periodData['Net Debt'] ?? 0;
      const WC = periodData['Working Capital'] ?? 0;
      const CCE = periodData['Cash And Cash Equivalents'] ?? 0;
      const TLN = periodData['Total Liabilities Net Minority Interest'] ?? 0;
      const TEG = periodData['Total Equity Gross Minority Interest'] ?? 0;
      const SE = periodData['Stockholders Equity'] ?? 0;
      const RE = periodData['Retained Earnings'] ?? 0;

      dataTable.push([
        datePeriod,
        totalAssets,
        totalDebt,
        netDebt,
        WC,
        CCE,
        TLN,
        TEG,
        SE,
        RE,
      ]);
    });
    this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);
    return dataTable;
  }

  convertToLineChartCashFlow(data: any) {
    // Initialize with header row
    const dataTable = [
      [
        'Period',
        'Free Cash Flow',
        'Cash Flows from Operating Activities Direct',
        'Capital Expenditure',
        'Cash Dividends Paid',
        'End Cash Position',
        'Net Long Term Debt Issuance',
        'Financing Cash Flow',
        'Investing Cash Flow',
        'Changes in Cash',
      ],
    ];

    Object.keys(data.q_cash_flow).forEach((period: any) => {
      const periodData = data.q_cash_flow[period];
      const datePeriod = new Date(period); // Convert date to timestamp
      const freeCashFlow = periodData['Free Cash Flow'] ?? 0;
      const CFFOAD =
        periodData['Cash Flowsfromusedin Operating Activities Direct'] ?? 0;
      const CE = periodData['Capital Expenditure'] ?? 0;
      const CDP = periodData['Cash Dividends Paid'] ?? 0;
      const ECP = periodData['End Cash Position'] ?? 0;
      const NLTDI = periodData['Net Long Term Debt Issuance'] ?? 0;
      const FCF = periodData['Financing Cash Flow'] ?? 0;
      const ICF = periodData['Investing Cash Flow'] ?? 0;
      const CC = periodData['Changes In Cash'] ?? 0;

      dataTable.push([
        datePeriod,
        freeCashFlow,
        CFFOAD,
        CE,
        CDP,
        ECP,
        NLTDI,
        FCF,
        ICF,
        CC,
      ]);
    });
    this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);
    return dataTable;
  }
}
