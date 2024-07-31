import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { StockInfoComponent } from '../../../features/components/stock-info/stock-info/stock-info.component';
import { FooterComponent } from '../footer/footer.component';
import { DashboardCanvasComponent } from '../dashboard-canvas/dashboard-canvas.component';
import { NgClass, NgIf } from '@angular/common';
import { HistogramAnalysisComponent } from '../../../features/components/histogram-analysis/histogram-analysis.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    NavbarComponent,
    StockInfoComponent,
    FooterComponent,
    DashboardCanvasComponent,
    NgIf,
    NgClass,
    HistogramAnalysisComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  feature: string = 'info';


  ngOnInit(): void {
    console.log('dc feature', this.feature);
  }

  ngOnChanges(){
    this.onTabChange(this.feature);

  }

  onTabChange(feature: string) {
    this.feature = feature;
  }

  
}
