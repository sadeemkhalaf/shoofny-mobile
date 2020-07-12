import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchJobs'
})
export class SearchJobsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
