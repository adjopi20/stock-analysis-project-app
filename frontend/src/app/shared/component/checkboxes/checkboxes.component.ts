import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkboxes',
  standalone: true,
  imports: [NgFor],
  templateUrl: './checkboxes.component.html',
  styleUrl: './checkboxes.component.scss'
})
export class CheckboxesComponent {
  @Input() items: any[]=[];
  @Input() currentItem: string = '';
  @Output() itemEvent= new EventEmitter<string>();  

  ngOnInit(){
    this.currentItem
  }
  changeItem(item: string){
    this.itemEvent.emit(item);
    this.currentItem=item;
    console.log('currentItem',this.currentItem);
  }
}
