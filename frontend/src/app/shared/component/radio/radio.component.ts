import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [NgFor],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss'
})
export class RadioComponent {
  @Input() model : any;
  @Input() items: any[]=[];
  @Output() itemEvent = new EventEmitter<string>();
  @Input() currentItem: string = '';

  ngOnInit(){ 
  }

  onItemChange(item: string) {
    this.model.current = item;
    this.itemEvent.emit(item);
  }

  // change(item: string){
  //   this.model.current=item;
  //   this.itemEvent.emit(this.currentItem);
  //   console.log('currentGroupBy',this.currentItem);

  // }
}

// export interface ModelRadio{
//   list: any[];
//   current: string;
// }