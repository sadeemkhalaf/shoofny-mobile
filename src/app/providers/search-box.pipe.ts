import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class SearchBoxPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    console.log(items, searchText);
    return items.filter( it => {
      return it.slug.split('-').join(' ').toLowerCase().includes(searchText);
    });
   }
  }