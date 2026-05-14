import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uiTitleCase',
  standalone: false,
})
export class UiTitleCasePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    return value
      .trim()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }
}
