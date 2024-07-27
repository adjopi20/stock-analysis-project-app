import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { HistogramComponent } from '../../../shared/component/histogram/histogram.component';
import { CommonModule } from '@angular/common';
import { FilterComponentComponent } from '../../../shared/component/filter-component/filter-component.component';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-histogram-analysis',
  standalone: true,
  imports: [HistogramComponent, FilterComponentComponent, CommonModule ],
  templateUrl: './histogram-analysis.component.html',
  styleUrl: './histogram-analysis.component.scss'
})
export class HistogramAnalysisComponent {
  @Input() currentMetric : string = 'bookValue';
  // @Input() currentSector : string = '';
  // histogram = 
  // chartData: any[] = [];
  histogramData: any[] = [];
  stocklist: any[] = [];
  trimmedMean: number = 0;

  sectorList : any[] = ["Basic Materials","Energy","Consumer Cyclical",
    "Healthcare","Utilities","Consumer Defensive","Real Estate",
    "Financial Services","Communication Services","Industrials","Technology"];
  metricList : any[] = [];

  constructor(private apiService : FlaskApiService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void{
    // this.getFilterOptions()
    this.getHistogramItems2();
    this.receiveChangeMetric(this.currentMetric)
  }

  // getFilterOptions() {
  //   this.apiService.getFilterOptions().subscribe({
  //     next: (data: any) => {
  //       // this.sectorList = data.sector;
  //       this.metricList = data.metrics;
  //       this.getHistogramItems2()
  //       // this.getHistogramItems();
  //       console.log(this.sectorList);
        
  //       },
  //     error: (error) => console.log(error),
  //     complete: () => console.log('complete'),
  //   });
  // }

  // getHistogramItems() {
  //   for (let sector of this.sectorList){
  //     this.apiService.getHistogramItems(sector, this.currentMetric).subscribe({
  //       next: (data: any) => {
  //         this.stocklist = data.stocklist;
  //         const dataTable = this.convertToChartData(this.stocklist);
  //         const title = `Sector: ${sector}, Metric: ${this.currentMetric}`
  //         // this.trimmedMean = data.trimmedMean;
  //         this.histogramData.push({sector, dataTable, title})
  //         console.log('dataTable ', dataTable);
  //         console.log('title ', title );
  //         console.log('sector ', sector);
  //         this.cdr.detectChanges();
          
  //       },
  //       error: (error) => console.log(error),
  //       complete: () => console.log('complete'),
  //     });
  //   }
  // }


  async getHistogramItems2() {
    for (let sector of this.sectorList){
      try {
        const data: any = await firstValueFrom(this.apiService.getHistogramItems(sector, this.currentMetric));
        const chartData = this.convertToChartData(data.stocklist);
        const title = `Sector: ${sector}, Metric: ${this.currentMetric}`
        this.histogramData.push({ sector, chartData, title });
        console.log(this.histogramData);
        
        
        // this.stocklist = data.stocklist;
        // this.trimmedMean = data.trimmedMean;
        // this.convertToChartData(this.stocklist);
        // console.log('chart data:', this.chartData);
        // console.log(this.currentMetric);
        this.cdr.detectChanges(); // Mark for check after data is updated
      } catch (error) {
        console.log(error);
      } finally {
        console.log('complete');
      }
    }
  }

  convertToChartData(data: any[]): any {
    const dataTable = [['Symbol', 'Metric']];
    data.forEach((item) => {
      dataTable.push([item.symbol, item[this.currentMetric]]);
    });
    this.cdr.detectChanges(); // Ensure view updates after setting chart data
    // console.log("chart: " + this.chartData);   
    return dataTable; 
  }


  receiveChangeMetric(event: string){
    this.currentMetric=event;
    this.histogramData = [];
    this.getHistogramItems2();
    console.log("parent: "+  this.currentMetric);
    
  }
}
