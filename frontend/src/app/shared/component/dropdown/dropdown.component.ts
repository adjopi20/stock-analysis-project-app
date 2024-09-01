import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
  @Input() items: any[] = [];
  @Input() currentItem: string | undefined;
  @Output() itemEvent = new EventEmitter<string>();
  @Input() label: string= '';

  onItemChange(event: Event){
    const value = (event?.target as HTMLSelectElement).value;
    const item = value.toString();
    this.itemEvent.emit(item);
    this.currentItem = item;
  }
}
