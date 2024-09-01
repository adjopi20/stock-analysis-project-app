import {
  Component,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { HistogramAnalysisComponent } from '../../../features/components/histogram-analysis/histogram-analysis.component';
import { StockInfoComponent } from '../../../features/components/stock-info/stock-info/stock-info.component';
import { NgComponentOutlet } from '@angular/common';
import { FinancialsComponent } from '../../../features/components/financials/financials.component';
import { NewsComponent } from '../../../features/components/news/news.component';
import { OverviewComponent } from '../../../features/components/overview/overview.component';

@Component({
  selector: 'app-dashboard-canvas',
  standalone: true,
  imports: [HistogramAnalysisComponent, StockInfoComponent, NgComponentOutlet],
  templateUrl: './dashboard-canvas.component.html',
  styleUrl: './dashboard-canvas.component.scss',
})
export class DashboardCanvasComponent {
  @Input() feature: string = '';

  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef; //fungsi penamaan container ini digunakan untuk html yang berisi komponen dgn menggunakan #
  //container ityu untuk menamai ng-template nya karena didalam #container tadi child nya akan ditampilkan

  private componentMap: { [key: string]: any } = {
    info: StockInfoComponent,
    histogram: HistogramAnalysisComponent,
    financials: FinancialsComponent,
    news: NewsComponent,
    overview: OverviewComponent
  }; //bikin objek komponent yang menampung semua kata kunci dari parent dan komponent yang berkolerasi
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feature']) {
      this.loadContent();
    }
  }

  loadContent() {
    this.container.clear(); //kosongkan kontainer viewchild biar komponen yang mau diganti terhapus
    const component = this.componentMap[this.feature];

    if (component) {
      this.container.createComponent(component);
    }
  }
}
