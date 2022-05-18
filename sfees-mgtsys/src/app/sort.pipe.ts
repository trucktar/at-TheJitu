import { Pipe, PipeTransform } from '@angular/core';

import { Student } from './student';

@Pipe({
  name: 'sort',
  pure: false,
})
export class SortPipe implements PipeTransform {
  transform(values: Student[], by: string): Student[] {
    if (by === 'name')
      return values.sort((a, b) => a.name.localeCompare(b.name));
    else if (by === 'balance')
      return values.sort((a, b) => a.balance - b.balance);
    else return values;
  }
}
