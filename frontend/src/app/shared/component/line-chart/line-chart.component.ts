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
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [Ng2GoogleChartsModule, NgIf],
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
      hAxis: { title: 'Period'},
      vAxis: { title: 'Amount' },
      // legend: { position: 'none' },
      interpolateNulls: true,
      explorer: {
        axis: 'vertical',
        keepInBounds: true,
        maxZoomIn: 4.0,
      },
    },
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    this.lineChart.dataTable = this.dataTable;
    this.lineChart.options.title = this.title;
    this.cdr.detectChanges();
  }
}
