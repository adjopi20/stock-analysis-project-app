import { Component } from '@angular/core';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NgFor],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  allNews: any[] = [];
  mainNews: any;
  resolutions: any[] = [];
  resolution: any = {};

  constructor(private apiService: FlaskApiService) {}

  ngOnInit(): void {
    this.getNews();
  }

  getNews() {
    this.apiService.getNews().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allNews = data;
        for (let item of this.allNews) {
          if (item['thumbnail']) {
            this.mainNews = item;
            this.resolutions = item.thumbnail.resolutions;
            this.resolution = this.resolutions[0] || {};;
            break;
          }
        }
      },
      error: (error) => console.error('Error news:', error),
      complete: () => console.log('complete'),
    });
  }
}
