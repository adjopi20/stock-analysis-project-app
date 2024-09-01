import { Pipe, PipeTransform } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(it => {
      return it.toLocaleLowerCase().includes(searchText);
    })
  }

}
