import { ChangeDetectorRef, Component, ElementRef, Input, Sanitizer } from '@angular/core';
import {
  GoogleChartInterface,
  GoogleChartType,
  Ng2GoogleChartsModule,
} from 'ng2-google-charts';
import { FlaskApiService } from '../../../features/flask-api-service/flask-api.service';
import { firstValueFrom } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-histogram',
  standalone: true,
  imports: [Ng2GoogleChartsModule, NgIf, CommonModule],
  templateUrl: './histogram.component.html',
  styleUrl: './histogram.component.scss',
})
export class HistogramComponent {
  @Input() sector: string = '';
  @Input() metric: string = '';
  histogramImageUrl: SafeUrl | null = null;
  stocklist: any[] = [];
  trimmedMean: number = 0;
  chartData: any[] = [];
  histogram: GoogleChartInterface = {
    chartType: GoogleChartType.Histogram,
    dataTable: [['Symbol', 'Metric']], // Initialize with empty data
    options: {
      title: '',
      legend: { position: 'none' },
      // histogram: {
      //   bucketSize: 0.1 
      // }
    },
  };

  constructor(
    private apiService: FlaskApiService,
    private el: ElementRef,
    private santizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.getHistogramItems();
    // setTimeout(() => this.getHistogramItems2(), 4000);
    // this.getHistogramImg();
    this.getHistogramItems2();

    this.updateHistogramTitle();
  }

  ngAfterViewInit(): void {

    // this.addPassiveEventListener();
  }

  // getHistogramItems() {
  //   this.apiService.getHistogramItems(this.sector, this.metric).subscribe({
  //     next: (data: any) => {
  //       this.stocklist = data.stocklist;
  //       this.trimmedMean = data.trimmedMean;
  //       this.convertToChartData(this.stocklist);
  //       console.log('chart data:', this.chartData);
  //     },
  //     error: (error) => console.log(error),
  //     complete: () => console.log('complete'),
  //   });
  // }

  async getHistogramItems2() {
    try {
      const data: any = await firstValueFrom(this.apiService.getHistogramItems(this.sector, this.metric));
      this.stocklist = data.stocklist;
      this.trimmedMean = data.trimmedMean;
      this.convertToChartData(this.stocklist);
      console.log('chart data:', this.chartData);
      this.cdr.markForCheck(); // Mark for check after data is updated

    } catch (error) {
      console.log(error);
    } finally {
      console.log('complete');

    }
  }

  getHistogramImg(){
    this.apiService.getHistogramPic(this.sector, this.metric).subscribe({
      next: (blob: Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.histogramImageUrl = this.santizer.bypassSecurityTrustHtml(objectUrl);
      },
      error: (error) => console.error(error),
      complete: () => console.log('complete')
    })
  }

  convertToChartData(data: any[]): void {
    this.chartData = [['Symbol', 'Metric']];
    data.forEach((item) => {
      this.chartData.push([item.symbol, item.returnOnEquity]);
    });
    this.histogram.dataTable = this.chartData;
  }

  addPassiveEventListener() {
    const scrollElement = this.el.nativeElement.querySelector('.scroll-container'); // Adjust the selector to target your specific element
    if (scrollElement) {
      scrollElement.addEventListener('mousewheel', this.onScroll, { passive: true });
    }
  }

  onScroll(event: Event) {
    console.log('Scroll event', event);
  }

  updateHistogramTitle(){
    this.histogram.options.title = "Sector: " + this.sector + " on Metric: " + this.metric;
  }
}
