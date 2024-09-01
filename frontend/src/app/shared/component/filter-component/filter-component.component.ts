import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() currentOption: string=''

  @Output() keywordEvent= new EventEmitter<string>()

  currentFilter: string = ''

  constructor(private apiService: FlaskApiService){}
  
  ngOnInit(){
    this.getFilter();
  }

  getFilter(){
    this.apiService.getFilterOptions().subscribe({
      next: (data) => {
        this.vessel=data[this.keyword]
      },
      error: (error) => console.log(error),
      complete: () => console.log('complete')
    })
  }

  changeOption(option: string){
    this.currentOption=option
    this.keywordEvent.emit(option)
    console.log('currentOption',this.currentOption);
    
    
  }



}
