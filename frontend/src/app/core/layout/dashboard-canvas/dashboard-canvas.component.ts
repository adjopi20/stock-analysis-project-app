import { Component } from '@angular/core';
import { HistogramAnalysisComponent } from '../../../features/components/histogram-analysis/histogram-analysis.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { FilterContainerComponent } from '../filter-container/filter-container.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-dashboard-canvas',
  standalone: true,
  imports: [HistogramAnalysisComponent, SideNavComponent, FilterContainerComponent, PaginationComponent],
  templateUrl: './dashboard-canvas.component.html',
  styleUrl: './dashboard-canvas.component.scss'
})
export class DashboardCanvasComponent {

}
