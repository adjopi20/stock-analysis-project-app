import { Component, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DashboardComponent } from '../../../features/components/stock-info/dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { DashboardCanvasComponent } from '../dashboard-canvas/dashboard-canvas.component';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    NavbarComponent,
    DashboardComponent,
    FooterComponent,
    DashboardCanvasComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  feature: string = 'info';

  ngOnInit(): void {
    console.log('feature', this.feature);
    
  }

  onTabChange(feature: string){
    this.feature=feature;
  } 
}
