import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-histogram-handler',
  standalone: true,
  imports: [],
  templateUrl: './histogram-handler.component.html',
  styleUrl: './histogram-handler.component.scss'
})
export class HistogramHandlerComponent {
  @Input() item: string = '';
  message: string = '';

  ngOnChanges(){
    this.onResponse(this.item);
  }

  onResponse(item: string){
    switch(item){
      case '404':
        this.message = 'STOCKS NOT FOUND';
        break;
      default:
        this.message = ''; // Clear message for other statuses
        break;
    }

  }
}
