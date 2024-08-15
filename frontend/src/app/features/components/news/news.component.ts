import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { FlaskApiService } from '../../flask-api-service/flask-api.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { NewsDirectiveDirective } from '../../../shared/directive/news-directive/news-directive.directive';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  @Input() allNews: any[] = [];
  @Input() mainNews: any;
  @Input() resolutions: any[] = [];
  @Input() resolution: any = {};
  @Input() relatedTickers: any[] = [];
  @Input() mainRelatedTickers: any[] = [];
  @Input() showAdditionalSection: boolean = true; // Add this input property
  @Input() titleSizeMain: string = 'is-5';
  @Input() subtitleSizeMain: string = 'is-5';
  @Input() titleSizeSubMain: string = 'is-6';
  @Input() subtitleSizeSubMain: string = 'is-6';


  slicedMainNews: any[]=[];
  slicedNews: any[]=[];
  slicedNewsImg: any[]=[];

  @ContentChild(NewsDirectiveDirective, {read: TemplateRef}) newsTemplate?: any;


  constructor(private apiService: FlaskApiService) {}

  ngOnInit(): void {
    this.getNews();
  }

  getNews() {
    this.apiService.getNews().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allNews = data;
        this.slicedNews = this.allNews.slice(5);
        this.slicedMainNews = this.allNews.slice(1, 5);

        // getImagesForItem(item)

        
        // for(let item of this.slicedNews){
        //   if (item.thumbnail && item.thumbnail.resolutions){
        //     this.slicedNewsImg.push(item.thumbnail.resolutions);
        //   } else{
        //     this.slicedNewsImg.push([])
        //   }
        // }

        this.relatedTickers=data.relatedTickers;
        for (let item of this.allNews) {
          if (item['thumbnail']) {
            this.mainNews = item;
            this.resolutions = item.thumbnail.resolutions;
            this.resolution = this.resolutions[0] || {};
            this.mainRelatedTickers = item.relatedTickers;

            break;
          }
        }
      },
      error: (error) => console.error('Error news:', error),
      complete: () => console.log('complete'),
    });
  }

  getImgForItem(item: any){
    // for(let i = 0; i < 2; i++){
    //   if(item.thumbnail?.resolutions[i]){
    //     return item.thumbnail?.resolutions[i]
    //   }
    // }
    return item.thumbnail?.resolutions || [];
   
  }
}
