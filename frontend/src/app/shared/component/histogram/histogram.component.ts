import { Component } from '@angular/core';
import { GoogleChartInterface, GoogleChartType, Ng2GoogleChartsModule } from 'ng2-google-charts';

@Component({
  selector: 'app-histogram',
  standalone: true,
  imports: [Ng2GoogleChartsModule, ],
  templateUrl: './histogram.component.html',
  styleUrl: './histogram.component.scss'
})
export class HistogramComponent {
  constructor(){}

  ngOnInit(){
    this.pieChart
  }
  
  public pieChart: GoogleChartInterface = {
    chartType: GoogleChartType.PieChart,
    dataTable: [
      ['Task', 'Hours per Day'],
      ['Work',     11],
      ['Eat',      2],
      ['Commute',  2],
      ['Watch TV', 2],
      ['Sleep',    7]
    ],
    //firstRowIsData: true,
    options: {'title': 'Tasks'},
  }
}
