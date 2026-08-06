import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableSearch',
  standalone: true
})
export class TableSearchPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items) return [];
    if (!searchTerm || !searchTerm.trim()) return items;

    const term = searchTerm.toLowerCase().trim();
    return items.filter(item => {
      return Object.values(item).some(val => 
        val !== null && val !== undefined && String(val).toLowerCase().includes(term)
      );
    });
  }
}
