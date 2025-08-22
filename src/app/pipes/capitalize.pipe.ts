import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalize',
    standalone: false
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return 'N/A'; // Handle undefined or empty values

    // Capitalize the first letter and make the rest lowercase
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
