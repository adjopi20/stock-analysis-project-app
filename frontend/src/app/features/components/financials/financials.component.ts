import { ChangeDetectorRef, Component } from '@angular/core';
import { DropdownComponent } from '../../../shared/component/dropdown/dropdown.component';
import { RadioComponent } from '../../../shared/component/radio/radio.component';
import { CheckboxesComponent } from '../../../shared/component/checkboxes/checkboxes.component';
import { LineChartComponent } from '../../../shared/component/line-chart/line-chart.component';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { firstValueFrom, map } from 'rxjs';
import { DatePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-financials',
  standalone: true,
  imports: [
    DropdownComponent,
    RadioComponent,
    CheckboxesComponent,
    FinancialsComponent,
    LineChartComponent,
    DatePipe,
    NgFor,
  ],
  templateUrl: './financials.component.html',
  styleUrl: './financials.component.scss',
})
export class FinancialsComponent {
  FinancialTypeList: any[] = ['Income Statement', 'Balance Sheet', 'Cash Flow'];
  currentFinancialType: string = 'Income Statement';

  sectorList: any[] = [];
  currentSector: string = '';

  industryList: any[] = [];
  currentIndustry: string = '';

  symbolList: any[] = [];
  selectedSymbol: any[] = [];

  rawData: any[] = [];
  dataInASector: any[] = [];

  lineChart: any[] = [];

  constructor(
    private apiService: FlaskApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getStockList();
    // this.getIncomeStatement();
    // this.test();
  }

  async getStockList() {
    try {
      const data = await firstValueFrom(this.apiService.getStockList());
      this.rawData = data.data;

      const filter = await firstValueFrom(this.apiService.getFilterOptions());
      this.sectorList = filter.sector.filter( (item: any) => item !== 'Unknown');

      this.currentSector = this.sectorList[0];

      for (let item of data.data) {
        if (this.currentSector === item['sector']) {
          this.dataInASector.push(item);
        }
      }
      this.industryList = [
        ...new Set(this.dataInASector.map((item: any) => item['industry'])),
      ];
      this.currentIndustry = this.industryList[0];

      for (let item of this.dataInASector) {
        if (
          this.currentSector === item['sector'] &&
          this.currentIndustry === item['industry']
        )
          this.symbolList.push(item['symbol']);
      }

      this.selectedSymbol.push(this.symbolList[0], this.symbolList[1]);
      console.log('selectedSymbol', this.selectedSymbol);

      if (this.currentFinancialType === 'Income Statement'){
        this.getIncomeStatement();
      } else if (this.currentFinancialType === 'Balance Sheet'){
        this.getBalSheet();
      } else if (this.currentFinancialType === 'Cash Flow'){
        this.getCashFlow();
      }

      // Object.keys(data.data).forEach((key) => {});

      // console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log('complete');
    }
  }

  async getIncomeStatement() {
    try {
      this.lineChart = []; // Clear previous data
      for (let symbol of this.selectedSymbol) {
        const data = await firstValueFrom(
          this.apiService.getQIncomeStatement(symbol)
        );

        // Check if data is available
        if (data) {
          const title = `Income Statement Summary on ${symbol}`;
          const dataTable = this.convertToLineChartIncStmt(data, symbol);
          this.lineChart.push({ title, dataTable });
          console.log('data table: ', dataTable);
        } else {
          console.warn(`No data returned for symbol: ${symbol}`);
        }
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
      this.lineChart = []; // Clear previous data
      for (let symbol of this.selectedSymbol) {
        const data = await firstValueFrom(this.apiService.getQBalSheet(symbol));

        // Check if data is available
        if (data) {
          const title = `Balance Sheet Summary on ${symbol}`;
          const dataTable = this.convertToLineChartBalSh(data, symbol);
          this.lineChart.push({ title, dataTable });
          console.log('data table: ', dataTable);
        } else {
          console.warn(`No data returned for symbol: ${symbol}`);
        }
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
      this.lineChart = []; // Clear previous data
      for (let symbol of this.selectedSymbol) {
        const data = await firstValueFrom(this.apiService.getQCashFlow(symbol));

        // Check if data is available
        if (data) {
          const title = `Cash Flow Summary on ${symbol}`;
          const dataTable = this.convertToLineChartCashFlow(data, symbol);
          this.lineChart.push({ title, dataTable });
          console.log('data table: ', dataTable);
        } else {
          console.warn(`No data returned for symbol: ${symbol}`);
        }
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.log('get income statement error: ', error);
    } finally {
      console.log('complete');
    }
  }

  convertToLineChartIncStmt(data: any, symbol: any) {
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

      const totalRevenue = periodData['Total Revenue'];
      const totalExpense = periodData['Total Expenses'];
      const operatingRevenue = periodData['Operating Revenue'];
      const operatingExpense = periodData['Operating Expense'];
      const EBITDA = periodData['EBITDA'];
      const grossProfit = periodData['Gross Profit'];
      const netIncome = periodData['Net Income'];
      const basicEPS = periodData['Basic EPS'];

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

  convertToLineChartBalSh(data: any, symbol: any) {
    // Initialize with header row
    const dataTable = [
      [ 'Period',
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
      const totalAssets = periodData['Total Assets'];
      const totalDebt = periodData['Total Debt'];
      const netDebt = periodData['Net Debt'];
      const WC = periodData['Working Capital'];
      const CCE = periodData['Cash And Cash Equivalents'];
      const TLN = periodData['Total Liabilities Net Minority Interest'];
      const TEG = periodData['Total Equity Gross Minority Interest'];
      const SE = periodData['Stockholders Equity'];
      const RE = periodData['Retained Earnings'];

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

  convertToLineChartCashFlow(data: any, symbol: any) {
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
      const freeCashFlow = periodData['Free Cash Flow'];
      const CFFOAD = periodData['Cash Flowsfromusedin Operating Activities Direct']
      const CE = periodData['Capital Expenditure'];
      const CDP = periodData['Cash Dividends Paid'];
      const ECP = periodData['End Cash Position'];
      const NLTDI = periodData['Net Long Term Debt Issuance'];
      const FCF = periodData['Financing Cash Flow'];
      const ICF = periodData['Investing Cash Flow'];
      const CC = periodData['Changes In Cash'];

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
        CC
      ]);
    });
    this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);
    return dataTable;
  }

  

  sectorChanged() {
    this.dataInASector = [];
    this.industryList = [];
    this.symbolList = [];

    for (let item of this.rawData) {
      if (this.currentSector === item['sector']) {
        this.dataInASector.push(item);
      }
    }
    this.industryList = [
      ...new Set(this.dataInASector.map((item: any) => item['industry'])),
    ];
    this.currentIndustry = this.industryList[0];

    for (let item of this.dataInASector) {
      if (
        this.currentSector === item['sector'] &&
        this.currentIndustry === item['industry']
      )
        this.symbolList.push(item['symbol']);
    }
    this.selectedSymbol = [];
    this.selectedSymbol.push(this.symbolList[0]);
  }

  industryChanged() {
    this.symbolList = [];
    for (let item of this.dataInASector) {
      if (
        this.currentSector === item['sector'] &&
        this.currentIndustry === item['industry']
      )
        this.symbolList.push(item['symbol']);
    }
    this.selectedSymbol = [];
    this.selectedSymbol.push(this.symbolList[0]);
  }

  receiveSetFinancialType(event: string) {
    // this.industryList = [];
    // this.sectorList = [];
    this.symbolList = [];
    this.selectedSymbol = []; 
    this.currentFinancialType = event;
    this.getStockList();
  }

  receiveSetSector(event: string) {
    this.currentSector = event;
    this.sectorChanged();
  }

  receiveSetIndustry(event: string) {
    this.currentIndustry = event;
    this.industryChanged();
  }

  receiveSetSymbol(event: string) {
    this.selectedSymbol = [];
    this.selectedSymbol.push(event);
  }
}
