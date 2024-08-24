import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { GoogleChartInterface, GoogleChartType, Ng2GoogleChartsModule } from 'ng2-google-charts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [Ng2GoogleChartsModule, NgIf],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent {
  @Input() title: string = '';
  @Input() dataTable: any[] = [];

  public pieChart: GoogleChartInterface = {
    chartType: GoogleChartType.PieChart,
    dataTable: [],
    options: {
      title: '',
      slices: {
        0: {offset: 0.3},
        1: {offset: 0.2}
      }
    }
  };

  dashboardPieChart: GoogleChartInterface = {
    chartType: GoogleChartType.PieChart,
    options: {
      width: 250,
      height: 250,
      legend: 'none',
      chartArea: {left: 15, top: 15, right: 0, bottom: 0},
      pieSliceText: 'label'
    },
    view: {columns: [0, 3]}
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    this.pieChart.dataTable = this.dataTable;
    this.pieChart.options.title = this.title;
    this.cdr.detectChanges();
  }


}
