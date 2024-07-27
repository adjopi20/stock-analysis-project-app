import { JsonPipe, KeyValuePipe, NgClass } from '@angular/common';
import { NONE_TYPE } from '@angular/compiler';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-container',
  standalone: true,
  imports: [NgClass, KeyValuePipe],
  templateUrl: './filter-container.component.html',
  styleUrl: './filter-container.component.scss',
})
export class FilterContainerComponent {
  @Input() listingBoard: any[] = [];
  @Input() recommendation: any[] = [];
  @Output() listingBoardEvent = new EventEmitter<string>();
  @Output() recommendationEvent = new EventEmitter<string>();
  currentListingBoard?: string;
  currentRecommendation?: string;

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

  changeRecommendation(recommendation: string){
    if (recommendation === this.currentRecommendation){
      this.currentRecommendation = '';
      this.recommendationEvent.emit('');
    } else {
      this.currentRecommendation= recommendation;
      this.recommendationEvent.emit(recommendation);
    }
  }
}
