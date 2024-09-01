import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListingBoardService {

  constructor() { }

  setColorListingBoard(listingBoard: string): string {
    switch (listingBoard) {
      case 'UTAMA':
        return 'is-info';
      case 'PENGEMBANGAN':
        return 'is-warning';
      case 'AKSELERASI':
        return 'is-white';
      case 'PEMANTAUAN KHUSUS':
        return 'is-danger';
      case 'EKONOMI BARU':
        return 'is-info';
      default:
        return '';
    }
  }
}
