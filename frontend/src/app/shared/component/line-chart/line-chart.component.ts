import {
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import {
  Ng2GoogleChartsModule,
  GoogleChartType,
  GoogleChartInterface,
} from 'ng2-google-charts';
import { HistogramAnalysisComponent } from '../../../features/components/histogram-analysis/histogram-analysis.component';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [Ng2GoogleChartsModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent {
  @Input() title: string = '';
  @Input() symbol: string = '';
  @Input() reportType: string = '';
  @Input() dataTable: any[] = [];

  public lineChart: GoogleChartInterface = {
    chartType: GoogleChartType.LineChart,
    dataTable: [
      // ['Period', 'bbca.jk'],
      // ['2022-12-31 00:00:00', null],
      // ['2023-03-31 00:00:00', null],
      // ['2023-06-30 00:00:00', 25146177000000],
      // ['2023-09-30 00:00:00', 25604842000000],
      // ['2023-12-31 00:00:00', 25607364000000],
      // ['2024-03-31 00:00:00', 26958313000000],
      // ['2024-06-30 00:00:00', 26832797000000],
    ],
    // formatters: [
    //   {
    //     columns: [1],
    //     type: 'NumberFormat',
    //     options: {
    //       prefix: '&euro;',
    //       negativeColor: 'red',
    //       negativeParens: true,
    //     },
    //   },
    // ],
    options: {
      title: '',
      hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
      vAxis: { title: 'Amount', minValue: 0 },
      legend: 'none',
      interpolateNulls: true,
    },
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    //   this.lineChart;
    //   try {
    //     // console.log('dataTable', this.dataTable);
    //     this.updateChart();
    //   } catch (error) {
    //     console.log('error', error);
    //   }
    // this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataTable'] && this.dataTable) {
      console.log('DataTable changed:', this.dataTable);
      this.lineChart;
      this.updateChart();
    }
  }

  updateChart() {
    this.lineChart.dataTable = this.dataTable;
    this.lineChart.options.title = this.title;
    console.log('dataTable', this.dataTable);
    console.log('linechart.dataTable', this.lineChart.dataTable);

    this.cdr.detectChanges();
  }
}
