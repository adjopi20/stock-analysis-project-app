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
  // @Input() symbol: string = '';
  @Input() reportType: string = '';
  @Input() dataTable: any[] = [];

  public lineChart: GoogleChartInterface = {
    chartType: GoogleChartType.LineChart,
    dataTable: [],
    options: {
      title: '',
      // hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
      // vAxis: { title: 'Amount', minValue: 50000000000000 },
      legend: { position: 'none' },
      interpolateNulls: true,
    },
  };

  constructor(private cdr: ChangeDetectorRef) {}

  
  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    this.lineChart.dataTable = this.dataTable;
    this.cdr.detectChanges();
  }
}

