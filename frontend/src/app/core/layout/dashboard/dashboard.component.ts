import { Component } from '@angular/core';
import { AllStocksService } from '../../../features/all-stocks-service/all-stocks.service';
import { NgFor } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { Perform } from '../../../shared/class/perform-class/perform';
import { SideNavComponent } from "../side-nav/side-nav.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, JsonPipe, SideNavComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  data = new Perform<[]>(); //jangan lupa sertakan <> untuk menspesifikkan output/keluaran fungsi kek di java kan "public dtype namafungsi(dtype parameter)"
  
  isLoading = false;
  hasError = false;

  constructor(private service: AllStocksService) { }

  

  ngOnInit() {
    this.data.load(this.service.getStockList())
    console.log(this.data.load(this.service.getStockList()))

  }
}
