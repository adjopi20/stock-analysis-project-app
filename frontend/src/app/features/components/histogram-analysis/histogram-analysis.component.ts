import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  model,
  Output,
} from '@angular/core';
import { HistogramComponent } from '../../../shared/component/histogram/histogram.component';
import { CommonModule, NgFor, NgSwitch } from '@angular/common';
import { FilterComponentComponent } from '../../../shared/component/filter-component/filter-component.component';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { firstValueFrom } from 'rxjs';
import {  RadioComponent } from '../../../shared/component/radio/radio.component';
import { CheckboxesComponent } from '../../../shared/component/checkboxes/checkboxes.component';
import { HistogramFilterComponent } from '../../../shared/component/histogram-filter/histogram-filter.component';

@Component({
  selector: 'app-histogram-analysis',
  standalone: true,
  imports: [
    HistogramComponent,
    CheckboxesComponent,
    FilterComponentComponent,
    RadioComponent,
    CommonModule,
    NgFor,
    HistogramFilterComponent,
    NgSwitch,
  ],
  templateUrl: './histogram-analysis.component.html',
  styleUrl: './histogram-analysis.component.scss',
})
export class HistogramAnalysisComponent {
  metricList: any[] = [];
  @Input() currentMetric: string = 'bookValue';
  sectorList: any[] = [];
  @Input() currentSector: string = 'Industrials';
  @Input() groups: any[] = ['Sector', 'Metric'];
  currentGroupBy: string = 'Metric';

  // histogram =
  // chartData: any[] = [];
  histogramData: any[] = [];
  stocklist: any[] = [];
  trimmedMean: number = 0;

  listingBoard: any[] = [];
  industryList: any[] = [];

  _model1 : any =  {
    list: this.groups,
    current: this.currentGroupBy,
  }

  _model2 : any =  {
    list: this.sectorList,
    current: this.currentSector,    
 }




  constructor(
    private apiService: FlaskApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.getFilterOptions()
    // this.receiveChangeMetric(this.currentMetric)
    this.getFilterOptions();
    // this.getHistogramItems();
    console.log('currentgrup: ' + this.currentGroupBy);
    
    this.getHistogramItems2();
  }

  getFilterOptions() {
    this.apiService.getFilterOptions().subscribe({
      next: (data: any) => {
        this.sectorList = data.sector.filter((item: any) => item !== 'Unknown');
        this.metricList = data.metrics;
        this.industryList = data.industry.filter(
          (item: any) => item !== 'Unknown'
        );
        this.listingBoard = data.listingBoard;
        this._model2.list = this.sectorList
        this._model2.current = this.currentSector
      
        console.log('sectorlist', this.sectorList);
        console.log('metriclist', this.metricList);
        console.log('industrylist', this.industryList);
        console.log('listingboardlist', this.listingBoard);
      },
      error: (error) => console.log(error),
      complete: () => console.log('complete'),
    });
  }

  // async getHistogramItems() {
  //   if (this.currentGroupBy === 'sector') {
  //     for (let metric of this.metricList) {
  //       try {
  //         // this.histogramData = [];
  //         const data: any = await firstValueFrom(
  //           this.apiService.getHistogramItems(this.currentSector, metric)
  //         );
  //         const chartData = this.convertToChartData(data.stocklist, metric);
  //         const title = `Sector: ${this.currentSector}, Metric: ${metric}`;
  //         this.histogramData.push({ metric, chartData, title });
  //         console.log('parent data:', this.histogramData);

  //         this.cdr.detectChanges(); // Mark for check after data is updated
  //       } catch (error) {
  //         console.log(error);
  //       } finally {
  //         console.log('complete');
  //       }
  //     }
  //   } else if (this.currentGroupBy==='Metric') {
  //     for (let sector of this.sectorList) {
  //       try {
  //         const data: any = await firstValueFrom(
  //           this.apiService.getHistogramItems(sector, this.currentMetric)
  //         );
  //         const chartData = this.convertToChartData(
  //           data.stocklist,
  //           this.currentMetric
  //         );
  //         const title = `Sector: ${sector}, Metric: ${this.currentMetric}`;
  //         this.histogramData.push({ sector, chartData, title });
  //         console.log('parent metric histdata', this.histogramData);

  //         this.cdr.detectChanges(); // Mark for check after data is updated
  //       } catch (error) {
  //         console.log(error);
  //       } finally {
  //         console.log('complete');
  //       }
  //     }
  //   }
  // }

  async getHistogramItems2() {
    try {
      // this.histogramData = [];
      const data: any = await firstValueFrom(
        this.apiService.getHistogramItems(this.currentSector, this.currentMetric)
      );
      const chartData = this.convertToChartData(data.stocklist, this.currentMetric);
      const title = `Sector: ${this.currentSector}, Metric: ${this.currentMetric}`;
      const metric = this.currentMetric
      this.histogramData.push({ metric, chartData, title });
      console.log('parent data:', this.histogramData);

      this.cdr.detectChanges(); // Mark for check after data is updated
    } catch (error) {
      console.log(error);
    } finally {
      console.log('complete');
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

  receiveSetMetric(event: string) {
    this.currentMetric = event;
    this.histogramData = []; //kosongkan dulu histogramnya
    // this.getHistogramItems();
    // this.getHistogramItems2();
    console.log('parent: ' + this.currentMetric);
  }

  receiveSetSector(event: string) {
    this.currentSector = event;
    this.histogramData = []; //kosongkan dulu histogramnya
    // this.getHistogramItems();
    // this.getHistogramItems2();
    console.log('parent: ' + this.currentSector);
  }

  receiveChangeGroupBy(event: string) {
    this.currentGroupBy = event;
    this.histogramData = []; //kosongkan dulu histogramnya
    // this.getHistogramItems();
    // this.getHistogramItems2();
    console.log('parent: ' + this.currentGroupBy);
  }
}
