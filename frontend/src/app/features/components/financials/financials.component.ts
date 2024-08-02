import { ChangeDetectorRef, Component } from '@angular/core';
import { DropdownComponent } from '../../../shared/component/dropdown/dropdown.component';
import { RadioComponent } from '../../../shared/component/radio/radio.component';
import { CheckboxesComponent } from '../../../shared/component/checkboxes/checkboxes.component';
import { LineChartComponent } from '../../../shared/component/line-chart/line-chart.component';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { firstValueFrom } from 'rxjs';
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
    NgFor
  ],
  templateUrl: './financials.component.html',
  styleUrl: './financials.component.scss',
})
export class FinancialsComponent {
  reportType: string = '';
  // title: string = '';
  symbol: string = 'bbca.jk';
  lineChart: any[] = [];

  constructor(
    private apiService: FlaskApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getIncomeStatement();
    // this.test();
  }


  async getIncomeStatement() {
    try {
      const periodList = [];
      const totalRevenueList = [];
      const netIncomeList = [];
      const operatingExpenseList = [];
      const operatingRevenueList = [];
      const basicEPSList = [];

      const data = await firstValueFrom(
        this.apiService.getIncomeStatement(this.symbol)
      );

      // Check if data is in the expected format
      // if (!data || typeof data !== 'object') {
      //   throw new Error('Unexpected response format');
      // }
      const title = `Total Revenue on ${this.symbol}`;
      const dataTable = this.convertToLineChart(data);
      this.lineChart.push({ title, dataTable });
      console.log('data table: ', dataTable);
      this.cdr.detectChanges();

      // const tes=new Date(data)
      // console.log('tes',tes);

      // for (let i = 0; i < data.q_income_statement.length; i++) {
      //   const period = data.q_income_statement[i].DatePipe('yyyy MMM');
      //   periodList.push(period);
      // }

      // console.log('period list', periodList);

      // for (let period of data.q_income_statement) {
      //   for (let metric of period) {
      //     const revenue = metric['Total Revenue'];
      //     if (revenue) {
      //       totalRevenueList.push(revenue);
      //     }
      //     const netIncome = metric['Net Income'];
      //     if (netIncome) {
      //       netIncomeList.push(netIncome);
      //     }
      //     const operatingExpense = metric['Operating Expense'];
      //     if (operatingExpense) {
      //       operatingExpenseList.push(operatingExpense);
      //     }
      //     const operatingRevenue = metric['Operating Revenue'];
      //     if (operatingRevenue) {
      //       operatingRevenueList.push(operatingRevenue);
      //     }
      //     const basicEPS = metric['Basic EPS'];
      //     if (basicEPS) {
      //       basicEPSList.push(basicEPS);
      //     }
      //   }
      // }

      
    } catch (error) {
      console.log('get income statement error: ', error);
    } finally {
      console.log('complete');
    }
  }

  convertToLineChart(data: any) {

    const dataTable = [['Period', this.symbol]];
    Object.keys(data.q_income_statement).forEach((period: any) => {
      const periodData=data.q_income_statement[period]
      const totalRevenue=periodData['Total Revenue']
      dataTable.push([
        period,
        totalRevenue
      ]);
    });
    this.cdr.detectChanges();
    console.log('dataTable: ', dataTable);
    return dataTable;
  }
}
