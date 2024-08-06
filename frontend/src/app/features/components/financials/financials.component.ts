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

  listingBoardList: any[] = [];
  currentListingBoard? : string | undefined ;

  symbolList: any[] = [];
  selectedSymbol: any[] = [];
  currentSymbol: string = '';

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
      this.listingBoardList = filter.listingBoard;
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
          this.currentIndustry === item['industry'] &&
          (this.currentListingBoard === undefined || this.currentListingBoard === item['listing_board'])
        )
          this.symbolList.push(item['symbol']);
      }
      
      if (this.symbolList.length > 0) {
        this.currentSymbol = this.symbolList[0];
        this.selectedSymbol.push(this.currentSymbol);
      }
      // this.selectedSymbol.push(this.symbolList[0]);
      // console.log('selectedSymbol', this.selectedSymbol);

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
      const freeCashFlow = periodData['Free Cash Flow'] ?? 0;
      const CFFOAD = periodData['Cash Flowsfromusedin Operating Activities Direct'] ?? 0;
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
        CC
      ]);
    });
    this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);
    return dataTable;
  }

  tes(){
    if (this.currentFinancialType === 'Income Statement'){
      this.getIncomeStatement();
    } else if (this.currentFinancialType === 'Balance Sheet'){
      this.getBalSheet();
    } else if (this.currentFinancialType === 'Cash Flow'){
      this.getCashFlow();
    }
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
    this.tes();
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
    this.tes();
  }

  receiveSetFinancialType(event: string) {
    // this.industryList = [];
    // this.sectorList = [];
    this.dataInASector = [];
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
    // this.selectedSymbol = [];
    this.currentSymbol = event;
    this.lineChart = [];
    // this.selectedSymbol.push(event);
    console.log('selectedSymbol: ', this.selectedSymbol);
    
    this.tes();
  }

  receiveSetListingBoard(event: string) {
    this.symbolList = [];
    this.selectedSymbol = [];
    this.dataInASector = [];

    this.currentListingBoard = event===''? undefined: event;
    this.getStockList();
    console.log('parent currenlistingboard: ' + this.currentListingBoard);
    console.log('selectedSymbol: ', this.selectedSymbol);
    console.log('symbollist', this.symbolList);
    
    
    
  }
}
