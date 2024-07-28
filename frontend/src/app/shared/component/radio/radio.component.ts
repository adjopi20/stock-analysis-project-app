import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss'
})
export class RadioComponent {
  @Output() groupByEvent = new EventEmitter<string>();
  @Input() currentGroupBy: string = '';

  ngOnInit(){
    // this.change(this.currentGroupBy)
  }

  change(group: string){
    this.currentGroupBy=group;
    this.groupByEvent.emit(this.currentGroupBy);
    console.log('currentGroupBy',this.currentGroupBy);
  }
}
