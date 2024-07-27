import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DashboardComponent } from '../../../features/components/stock-info/dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { DashboardCanvasComponent } from '../dashboard-canvas/dashboard-canvas.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    NavbarComponent,
    DashboardComponent,
    FooterComponent,
    DashboardCanvasComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {}
