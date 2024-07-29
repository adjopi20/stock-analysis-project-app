import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { HistogramComponent } from '../../../shared/component/histogram/histogram.component';
import { CommonModule } from '@angular/common';
import { FilterComponentComponent } from '../../../shared/component/filter-component/filter-component.component';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { firstValueFrom } from 'rxjs';
import { RadioComponent } from '../../../shared/component/radio/radio.component';

@Component({
  selector: 'app-histogram-analysis',
  standalone: true,
  imports: [HistogramComponent, FilterComponentComponent, RadioComponent, CommonModule ],
  templateUrl: './histogram-analysis.component.html',
  styleUrl: './histogram-analysis.component.scss'
})
export class HistogramAnalysisComponent {
  @Input() currentMetric : string = 'bookValue';
  @Input() currentSector : string = 'Industrials';
  // histogram = 
  // chartData: any[] = [];
  histogramData: any[] = [];
  stocklist: any[] = [];
  trimmedMean: number = 0;
  currentGroupBy: string = 'metric';

  sectorList : any[] = ["Basic Materials","Energy","Consumer Cyclical",
    "Healthcare","Utilities","Consumer Defensive","Real Estate",
    "Financial Services","Communication Services","Industrials","Technology"];
  metricList : any[] = ["bookValue","currentPrice",
    "currentRatio","debtToEquity","dividendRate",
    "dividendYield","earningsGrowth","earningsQuarterlyGrowth","ebitda","ebitdaMargins",
    "enterpriseToEbitda","enterpriseToRevenue","enterpriseValue","floatShares","forwardEps",
    "forwardPE","freeCashflow","grossMargins","heldPercentInsiders","heldPercentInstitutions",
    "marketCap","netIncomeToCommon","operatingCashflow","operatingMargins","payoutRatio",
    "pegRatio","priceToBook","profitMargins","quickRatio","returnOnAssets","returnOnEquity",
    "revenueGrowth","revenuePerShare","sharesOutstanding","stock_shares","totalCash",
    "totalCashPerShare","totalRevenue","trailingEps","trailingPE","volume"
  ];

  constructor(private apiService : FlaskApiService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void{
    // this.getFilterOptions()
    // this.receiveChangeMetric(this.currentMetric)
    this.getHistogramItems();

  }

  ngOnChanges(): void{

  }

  // async getHistogramItems() {
  //   this.histogramData = [];
  //   this.cdr.detectChanges();

  //   if (this.currentGroupBy === 'sector') {
  //     await this.loadByMetric();
  //   } else if (this.currentGroupBy === 'metric') {
  //     await this.loadBySector();
  //   }
  // }

  // async loadByMetric() {
  //   for (let metric of this.metricList) {
  //     try {
  //       const data: any = await firstValueFrom(this.apiService.getHistogramItems(this.currentSector, metric));
  //       if (data && data.stocklist) {
  //         const chartData = this.convertToChartData(data.stocklist, metric);
  //         const title = `Sector: ${this.currentSector}, Metric: ${metric}`;
  //         this.histogramData.push({ metric, chartData, title });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   this.cdr.detectChanges();
  // }

  // async loadBySector() {
  //   for (let sector of this.sectorList) {
  //     try {
  //       const data: any = await firstValueFrom(this.apiService.getHistogramItems(sector, this.currentMetric));
  //       if (data && data.stocklist) {
  //         const chartData = this.convertToChartData(data.stocklist, this.currentMetric);
  //         const title = `Sector: ${sector}, Metric: ${this.currentMetric}`;
  //         this.histogramData.push({ sector, chartData, title });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   this.cdr.detectChanges();
  // }

  async getHistogramItems() {
    if (this.currentGroupBy === 'sector'){
      for (let metric of this.metricList){
        try {
          // this.histogramData = [];
          const data: any = await firstValueFrom(this.apiService.getHistogramItems(this.currentSector,metric));
          const chartData = this.convertToChartData(data.stocklist, metric);
          const title = `Sector: ${this.currentSector}, Metric: ${metric}`
          this.histogramData.push({ metric, chartData, title });
          console.log('parent data:', this.histogramData);
          
          this.cdr.detectChanges(); // Mark for check after data is updated
        } catch (error) {
          console.log(error);
        } finally {
          console.log('complete');
        }}
    } else if (this.currentGroupBy === 'metric') {
      for (let sector of this.sectorList){
        try {
          const data: any = await firstValueFrom(this.apiService.getHistogramItems(sector, this.currentMetric));
          const chartData = this.convertToChartData(data.stocklist, this.currentMetric);
          const title = `Sector: ${sector}, Metric: ${this.currentMetric}`
          this.histogramData.push({ sector, chartData, title });
          console.log(this.histogramData);
          
          this.cdr.detectChanges(); // Mark for check after data is updated
        } catch (error) {
          console.log(error);
        } finally {
          console.log('complete');
        }
    }
    
    }
  }

  convertToChartData(data: any[], metric: string): any {
    const dataTable = [['Symbol', 'Metric']];
  
      data.forEach((item) => {
        dataTable.push([item.symbol, item[metric]]);
      });
      this.cdr.detectChanges(); // Ensure view updates after setting chart data
      // console.log("chart: " + this.chartData);    
    return dataTable; 
  }


  receiveChangeMetric(event: string){
    this.currentMetric=event;
    this.histogramData = []; //kosongkan dulu histogramnya
    this.getHistogramItems();
    console.log("parent: "+  this.currentMetric);
  }
  
  receiveChangeSector(event: string){
    this.currentSector=event;
    this.histogramData = []; //kosongkan dulu histogramnya
    this.getHistogramItems();
    console.log("parent: "+  this.currentSector);
  }
  

  receiveChangeGroupBy(event:string){
    this.currentGroupBy = event;
    this.histogramData = []; //kosongkan dulu histogramnya
    this.getHistogramItems();
    console.log("parent: "+  this.currentGroupBy);
  }
}
