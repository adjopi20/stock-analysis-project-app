import { Component, Input } from '@angular/core';
import { FlaskApiService } from '../../../features/flask-api-service/flask-api.service';
import { JsonPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-filter-component',
  standalone: true,
  imports: [NgClass, JsonPipe],
  templateUrl: './filter-component.component.html',
  styleUrl: './filter-component.component.scss'
})
export class FilterComponentComponent {
  @Input() keyword: string= ''
  @Input() vessel: any[] = []
  tes: any[] = []
  @Input() currentOption: string=''

  constructor(private apiService: FlaskApiService){}
  
  ngOnInit(){
    this.getFilter();
  }

  getFilter(){
    this.apiService.getFilterOptions().subscribe({
      next: (data) => {
        this.vessel=data[this.keyword]
        this.tes=data

        console.log('ada ga ya: ' + this.keyword);
        console.log('ada ga ya2: ' + this.vessel);
        console.log('ada ga ya2: ' + this.tes);

        
        
      },
      error: (error) => console.log(error),
      complete: () => console.log('complete')
    })
  }

}
