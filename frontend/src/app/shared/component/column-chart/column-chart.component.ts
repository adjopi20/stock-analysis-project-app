import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { GoogleChartInterface, GoogleChartType, Ng2GoogleChartsModule } from 'ng2-google-charts';

@Component({
  selector: 'app-column-chart',
  standalone: true,
  imports: [Ng2GoogleChartsModule, NgIf],
  templateUrl: './column-chart.component.html',
  styleUrl: './column-chart.component.scss'
})
export class ColumnChartComponent {
  @Input() title: string = '';
  @Input() reportType: string = '';
  @Input() dataTable: any[] = [];

  public columnChart: GoogleChartInterface = {
    chartType: GoogleChartType.ColumnChart,
    dataTable: [],
    options: {
      title: '',
      hAxis: { title: 'Period'},
      vAxis: { title: 'Amount' },
      // legend: { position: 'none' },
      interpolateNulls: true,
      explorer: {
        axis: 'horizontal',
        keepInBounds: true,
        maxZoomIn: 2.0,
        maxZoomOut: 1.0,
      },
    },
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    this.columnChart.dataTable = this.dataTable;
    this.columnChart.options.title = this.title;
    this.cdr.detectChanges();
  }
}