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
  currentFinancialType: string = '';

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
    this.getIncomeStatement();
    // this.test();
  }

  async getStockList() {
    try {
      const data = await firstValueFrom(this.apiService.getStockList());
      this.rawData = data.data;

      const filter = await firstValueFrom(this.apiService.getFilterOptions());
      this.sectorList = filter.sector;
      this.currentSector = this.sectorList[0];
      
      for(let item of data.data){
        if (this.currentSector === item['sector']){
          this.dataInASector.push(item);
        }
      }    
      this.industryList= [...new Set(this.dataInASector.map((item: any) => item['industry']))];
      this.currentIndustry = this.industryList[0];
      

      for (let item of this.dataInASector) {
        if (this.currentSector === item['sector'] && this.currentIndustry === item['industry'])
          this.symbolList.push(item['symbol']);
      }

      this.selectedSymbol.push(this.symbolList[0], this.symbolList[1]);
      console.log('selectedSymbol', this.selectedSymbol);
      
      this.getIncomeStatement();
    
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
        const data = await firstValueFrom(this.apiService.getQIncomeStatement(symbol));
        
        // Check if data is available
        if (data) {
          const title = `Total Revenue on ${symbol}`;
          const dataTable = this.convertToLineChart(data, symbol);
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
  
  

  convertToLineChart(data: any, symbol: any) {
    // Initialize with header row
    const dataTable = [['Period', symbol]];
  
    // Check if data and q_income_statement are defined and non-empty
    if (data && data.q_income_statement && Object.keys(data.q_income_statement).length > 0) {
      // Process each period in q_income_statement
      Object.keys(data.q_income_statement).forEach((period: any) => {
        const periodData = data.q_income_statement[period];
        const datePeriod = new Date(period).getTime(); // Convert date to timestamp
  
        // Extract relevant data, handle potential null values
        const totalRevenue = periodData['Total Revenue'] ?? 0; // Default to 0 or another placeholder if null
  
        dataTable.push([datePeriod, totalRevenue]);
      });
    } else {
      // Handle case where q_income_statement is empty or missing
      console.warn(`No data available for symbol: ${symbol}`);
      // Optionally add a placeholder row
      dataTable.push([Date.now(), 0]); // Use current date/time and 0 as placeholder
    }
  
    this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);
    return dataTable;
  }
  
  

  sectorChanged() {
    this.dataInASector = [];
    this.industryList = [];
    this.symbolList = [];

    for(let item of this.rawData){
      if (this.currentSector === item['sector']){
        this.dataInASector.push(item);
      }
    }
    this.industryList= [...new Set(this.dataInASector.map((item: any) => item['industry']))];
    this.currentIndustry = this.industryList[0];

    for (let item of this.dataInASector) {
      if (this.currentSector === item['sector'] && this.currentIndustry === item['industry'])
        this.symbolList.push(item['symbol']);
    }
    this.selectedSymbol = []
    this.selectedSymbol.push(this.symbolList[0])
  }

  industryChanged(){
    this.symbolList = [];
    for (let item of this.dataInASector) {
      if (this.currentSector === item['sector'] && this.currentIndustry === item['industry'])
        this.symbolList.push(item['symbol']);
    }
    this.selectedSymbol = []
    this.selectedSymbol.push(this.symbolList[0])
  }

  
  receiveSetFinancialType(event: string) {
    this.currentFinancialType = event;
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
