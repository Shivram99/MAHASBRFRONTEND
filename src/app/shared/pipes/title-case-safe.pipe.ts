import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCaseSafe',
  standalone: false,
})
export class TitleCaseSafePipe implements PipeTransform {
  transform(value: string | number | null | undefined): string | number {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'number') {
      return value;
    }

    const normalizedValue = value.trim().replace(/\s+/g, ' ');

    if (!normalizedValue) {
      return '';
    }

    if (!/[A-Za-z]/.test(normalizedValue) || /^\d+$/.test(normalizedValue)) {
      return normalizedValue;
    }

    return normalizedValue
      .toLowerCase()
      .replace(/(^|[\s\-/'(])([a-z])/g, (_match, prefix: string, character: string) => {
        return `${prefix}${character.toUpperCase()}`;
      });
  }
}
