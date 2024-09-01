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
  // @Input() model : Model = {
  //   list: [],
  //   current: ''
  // } ;
  @Input() currentItem: string = '';
  @Input() items: any[]=[];
  @Input() groupName: string = '';
  @Output() itemEvent = new EventEmitter<string>();
  @Input() label: string = '';

  ngOnInit(){ 
  }

  onItemChange(item: string) {
    this.currentItem = item;
    this.itemEvent.emit(item);
  }

  change(item: string){
    this.currentItem=item;
    this.itemEvent.emit(this.currentItem);
    console.log('currentGroupBy',this.currentItem);
  }
}
