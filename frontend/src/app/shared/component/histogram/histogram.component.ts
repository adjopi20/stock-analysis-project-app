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
  @Input() industry: string | undefined;
  @Input() listingBoard: string | undefined;
  @Input() trimmedMean: number=0;
  @Input() dataTable: any = [];
  @Input() title: string = '';

  histogram: GoogleChartInterface = {
    chartType: GoogleChartType.Histogram,
    dataTable: [],
    options: {
      title: '',
      subtitle: '',
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

  ngOnChanges(change : SimpleChanges){
    if (change['dataTable'] || change['title']){
      this.updateHistogram();
    }
  }



  updateHistogram(){
    // if (this.dataTable.length > 1){
      this.histogram.dataTable = this.dataTable;
      this.histogram.options.title = this.title;
      this.histogram.options.subtitle = `${this.trimmedMean}`;
    // } else if (this.dataTable.length == 1) {
    //   this.histogram.options.title = `${this.title} NOT FOUND`;
    //   this.histogram.options.subtitle = `NOT FOUND`;
    // }
    console.log('histogram datatable',this.dataTable);
    console.log('histogram.datatable',this.histogram.dataTable);

    
    
    this.cdr.detectChanges();
  }

}
