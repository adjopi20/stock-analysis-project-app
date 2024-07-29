import { Component } from '@angular/core';
import { HistogramAnalysisComponent } from '../../../features/components/histogram-analysis/histogram-analysis.component';
  
@Component({
  selector: 'app-dashboard-canvas',
  standalone: true,
  imports: [
    HistogramAnalysisComponent,
  ],
  templateUrl: './dashboard-canvas.component.html',
  styleUrl: './dashboard-canvas.component.scss',
})
export class DashboardCanvasComponent {}
