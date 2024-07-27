import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, Sanitizer, SimpleChange, SimpleChanges } from '@angular/core';
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
  @Input() dataTable: any[] = [['Symbol', 'Metric']];
  @Input() title: string = '';


  histogram: GoogleChartInterface = {
    chartType: GoogleChartType.Histogram,
    dataTable: this.dataTable,
    options: {
      title: this.title,
      legend: { position: 'none' },
      // histogram: {
      //   bucketSize: 0.1 
      // }
    },
  };

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(){
    this.updateHistogram();
  }

  // ngOnChanges(change : SimpleChanges){
  //   if (change['dataTable'] || change['title']){
  //     this.updateHistogram();
  //   }
  // }



  updateHistogram(){
    this.histogram.dataTable = this.dataTable;
    this.histogram.options.title = this.title;
    this.cdr.detectChanges();
  }

}
