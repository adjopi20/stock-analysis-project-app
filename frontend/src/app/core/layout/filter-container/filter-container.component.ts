import { NgClass } from '@angular/common';
import { NONE_TYPE } from '@angular/compiler';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-container',
  standalone: true,
  imports: [NgClass],
  templateUrl: './filter-container.component.html',
  styleUrl: './filter-container.component.scss',
})
export class FilterContainerComponent {
  @Input() listingBoard: any[] = [];
  @Output() listingBoardEvent = new EventEmitter<string>();
  currentListingBoard?: string;

  changeListingBoard(listingBoard: string) {
    if (listingBoard === this.currentListingBoard) {
      // If clicking the same filter again, toggle to fetch all items
      this.currentListingBoard = ''; // Reset current listingBoard
      this.listingBoardEvent.emit(''); // Emit an empty string to fetch all
    } else {
      // Otherwise, set the filter to the selected listingBoard
      this.currentListingBoard = listingBoard;
      this.listingBoardEvent.emit(listingBoard); // Emit the specific listingBoard
    } 
    // this.isActive = !this.isActive;
  }
}
