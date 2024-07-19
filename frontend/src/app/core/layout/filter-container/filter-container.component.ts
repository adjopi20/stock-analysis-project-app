import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-container',
  standalone: true,
  imports: [NgClass],
  templateUrl: './filter-container.component.html',
  styleUrl: './filter-container.component.scss'
})
export class FilterContainerComponent {
  @Input() listingBoard:any[] = [];
  isActive: boolean = false;

  toggleNotif(){
    this.isActive = !this.isActive;
  }
}
