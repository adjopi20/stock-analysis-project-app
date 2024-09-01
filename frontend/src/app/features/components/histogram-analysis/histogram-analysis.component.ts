import {
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { HistogramComponent } from '../../../shared/component/histogram/histogram.component';
import { CommonModule, NgFor, NgSwitch } from '@angular/common';
import { FilterComponentComponent } from '../../../shared/component/filter-component/filter-component.component';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { firstValueFrom, groupBy } from 'rxjs';
import { RadioComponent } from '../../../shared/component/radio/radio.component';
import { CheckboxesComponent } from '../../../shared/component/checkboxes/checkboxes.component';
import { HistogramFilterComponent } from '../../../shared/component/histogram-filter/histogram-filter.component';
import { DropdownComponent } from '../../../shared/component/dropdown/dropdown.component';
import { HttpErrorResponse } from '@angular/common/http';
import { HistogramHandlerComponent } from '../../../shared/component/histogram-handler/histogram-handler.component';

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
    DropdownComponent,
    HistogramHandlerComponent,
  ],
  templateUrl: './histogram-analysis.component.html',
  styleUrl: './histogram-analysis.component.scss',
})
export class HistogramAnalysisComponent {
  metricList: any[] = [];
  currentMetric: string = '';
  selectedMetric: any[] = [];

  sectorList: any[] = [];
  currentSector: string = '';
  selectedSector: any[] = [];

  groups: any[] = ['Sector', 'Metric'];
  currentGroupBy: string = 'Metric';

  listingBoardList: any[] = [];
  currentListingBoard?: string | undefined;

  industryList: any[] = [];
  currentIndustry?: string | undefined;

  errorStatus: string = '';

  // histogram =
  // chartData: any[] = [];
  histogramData: any[] = [];
  stocklist: any[] = [];
  trimmedMean: number = 0;

  constructor(
    private apiService: FlaskApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getFilterOptions();
    console.log('parent, group: ', this.currentGroupBy); 
    // this.subscribeGroupSector();

  }

  ngOnChanges() {
  }

  getFilterOptions() {
    this.apiService.getFilterOptions().subscribe({
      next: (data: any) => {
        this.sectorList = data.sector.filter((item: any) => item !== 'Unknown');
        this.metricList = data.metrics;
        this.industryList = data.industry.filter(
          (item: any) => item !== 'Unknown'
        );
        this.listingBoardList = data.listingBoard;

        if (this.sectorList.length > 0) {
          this.currentSector = this.sectorList[0];
          this.selectedSector = [this.currentSector];
        }
        if (this.metricList.length > 0) {
          this.currentMetric = this.metricList[0];
          this.selectedMetric = [this.currentMetric];
        }
        this.currentListingBoard = '';
        this.currentIndustry = '';
        this.tes();
        
      },
      error: (error) => console.log(error),
      complete: () => console.log('complete'),
    });
  }

  tes() {
    if (this.currentGroupBy === 'Metric') {
      this.subscribeGroupMetric();
    } else if (this.currentGroupBy === 'Sector') {
      this.subscribeGroupSector();
    }
  }

  async subscribeGroupSector(){
    try {
      for (let metric of this.selectedMetric) {
        const data: any = await firstValueFrom(
          this.apiService.getHistogramItems(
            this.currentSector,
            metric,
            this.currentListingBoard,
            this.currentIndustry
          )
        );
        this.trimmedMean = data.trimmedMean;
        const chartData = this.convertToChartData(data.stocklist, metric);
        const listingBoard = this.currentListingBoard;
        const industry = this.currentIndustry;
        const title = `Sector: ${this.currentSector}, Metric: ${metric}, Listing Board: ${listingBoard}, Industry: ${industry}`;
        this.histogramData.push({ metric, chartData, title });

        console.log('parent data:', this.histogramData);
        this.cdr.detectChanges(); // Mark for check after data is updated
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status == 404) {
        this.errorStatus = '404';}
      console.log('Error fetching histogram items:', error);
    } finally {
      console.log('complete');
    }
  }

  async subscribeGroupMetric(){
    try {
      for (let sector of this.selectedSector) {
        // this.histogramData = [];
        const data: any = await firstValueFrom(
          this.apiService.getHistogramItems(
            sector,
            this.currentMetric,
            this.currentListingBoard,
            this.currentIndustry
          )
        );
        const chartData = this.convertToChartData(
          data.stocklist,
          this.currentMetric
        );
        this.trimmedMean = data.trimmedMean;
        const listingBoard = this.currentListingBoard;
        const industry = this.currentIndustry;
        const title = `Sector: ${sector}, Metric: ${this.currentMetric}, Listing Board: ${listingBoard}, Industry: ${industry}`;
        this.histogramData.push({ sector, chartData, title });
        this.cdr.detectChanges(); // Mark for check after data is updated
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status == 404) {
        this.errorStatus = '404';}
      console.log('Error fetching histogram items:', error);
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
    console.log('parent datatable:', dataTable);
    
    return dataTable;

  }

  receiveSetMetric(event: string) {
    if (this.currentGroupBy === 'Sector') {
      this.histogramData = [];
      this.currentMetric = event;
      this.subscribeGroupSector();
    } else if (this.currentGroupBy === 'Metric') {
      this.currentMetric = event;
      this.histogramData = [];
      this.subscribeGroupMetric();
    }
    console.log('parent: ' + this.currentMetric);
  }

  receiveSetSector(event: string) {
    if (this.currentGroupBy === 'Sector') {
      this.currentSector = event;
      this.histogramData = [];
      this.subscribeGroupSector();
      console.log('parent: ' + this.currentSector);
    } else if (this.currentGroupBy === 'Metric') {
      this.histogramData = [];
      this.currentSector = event;
      this.subscribeGroupMetric();
    }
    console.log('parent: ' + this.currentSector);
  }

  receiveChangeGroupBy(event: string) {
    this.currentGroupBy = event;
    this.histogramData = []; 
    this.getFilterOptions();    
  }

  receiveSetListingBoard(event: string) {
    if (this.currentGroupBy === 'Sector') {
      this.currentListingBoard = event;
      this.histogramData = [];
      this.subscribeGroupSector();
    } else if (this.currentGroupBy === 'Metric') {
      this.currentListingBoard = event;
      this.histogramData = [];
      this.subscribeGroupMetric();
    }
  }

  receiveSetIndustry(event: string) {
    if (this.currentGroupBy === 'Sector') {
      this.currentIndustry = event;
      this.histogramData = [];
      this.subscribeGroupSector();
    } else if (this.currentGroupBy === 'Metric') {
      this.currentIndustry = event;
      this.histogramData = [];
      this.subscribeGroupMetric();
    }

    
  }
}
