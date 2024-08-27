import { ChangeDetectorRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FinancialsService {

  constructor(
    // private cdr: ChangeDetectorRef
  ) {
    
  }
  convertToChartIncStmt(data: any, symbol: string) {
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

    Object.keys(data.income_statement).forEach((period: any) => {
      const periodData = data.income_statement[period];
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
    // this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);
    return dataTable;
  }

  convertToChartBalSh(data: any, symbol: string) {
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

    Object.keys(data.balance_sheet).forEach((period: any) => {
      const periodData = data.balance_sheet[period];
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
    // this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);
    return dataTable;
  }

  

  convertToChartCashFlow(data: any, symbol: string) {
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

    Object.keys(data.cash_flow).forEach((period: any) => {
      const periodData = data.cash_flow[period];
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
    // this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);
    return dataTable;
  }
}
