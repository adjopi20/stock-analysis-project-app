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
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
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
    NgFor,
    NgStyle
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  feature: string = 'overview';
  items: any[] = [
    '../../../../assets/download',
    '../../../../assets/TES1.png',
    '../../../../assets/TES3.png',
    '../../../../assets/TES6.png',
    '../../../../assets/TES5.png',
  ];
  colors: any[] = [
    "has-background-danger-dark",
    "has-background-warning-dark",
    "has-background-info-dark",
    "has-background-dark",
    "has-background-black",
  ]
  currentIndex: number = 0;
  intervalId: any;

  ngOnInit(): void {
    console.log('dc feature', this.feature);
    this.startPresentation();
  }

  ngOnChanges() {
    this.onTabChange(this.feature);
  }

  onTabChange(feature: string) {
    this.feature = feature;
  }
  startPresentation(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
    }, 5000); 
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
