import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NewsComponent } from '../news/news.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [NgFor, NgIf, NewsComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  
}
