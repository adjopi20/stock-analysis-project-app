import { Component } from '@angular/core';
import { HistogramAnalysisComponent } from '../../../features/components/histogram-analysis/histogram-analysis.component';
import { SideNavComponent } from '../../../features/components/stock-info/side-nav/side-nav.component';
import { FilterContainerComponent } from '../../../features/components/stock-info/filter-container/filter-container.component';
import { PaginationComponent } from '../../../features/components/stock-info/pagination/pagination.component';
import { FilterComponentComponent } from '../../../shared/component/filter-component/filter-component.component';
import { RadioComponent } from '../../../shared/component/radio/radio.component';

@Component({
  selector: 'app-dashboard-canvas',
  standalone: true,
  imports: [
    HistogramAnalysisComponent,
    SideNavComponent,
    FilterComponentComponent,
    PaginationComponent,
    RadioComponent
  ],
  templateUrl: './dashboard-canvas.component.html',
  styleUrl: './dashboard-canvas.component.scss',
})
export class DashboardCanvasComponent {}
