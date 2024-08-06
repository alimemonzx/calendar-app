import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnderscore',
  standalone: true,
})
export class RemoveUnderscorePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value.replace(/_/g, '');
  }
}
