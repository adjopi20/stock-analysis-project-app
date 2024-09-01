import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkboxes',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './checkboxes.component.html',
  styleUrl: './checkboxes.component.scss'
})
export class CheckboxesComponent {
  @Input() items: any[]=[];
  @Input() currentItem: any[] = [];
  @Output() itemEvent= new EventEmitter<string>();  
  @Input() groupName: string = '';
  @Input() label: string = '';

  ngOnInit(){
    console.log('checkbox items',this.items);
    console.log('checkbox currentItem',this.currentItem);
  }

  changeItem(item: string){
    const index = this.currentItem.indexOf(item);
    if (index > -1) {
      this.currentItem.splice(index, 1);
    } else {
      this.currentItem.push(item);
    }
    this.itemEvent.emit(item);
    console.log('currentItem',this.currentItem);
  }

  isChecked(item: string): boolean{
    return this.currentItem.includes(item);
  }
}
