import { Component } from '@angular/core';
import { HistogramComponent } from '../../../shared/component/histogram/histogram.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-histogram-analysis',
  standalone: true,
  imports: [HistogramComponent, ],
  templateUrl: './histogram-analysis.component.html',
  styleUrl: './histogram-analysis.component.scss'
})
export class HistogramAnalysisComponent {

}
