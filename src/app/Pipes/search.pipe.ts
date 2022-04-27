import { Pipe, PipeTransform } from '@angular/core';
import { File } from 'src/app/Classes/file';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(files: File[], searchValue: string) {
    if (searchValue) {
      return files.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));
    } else return files;
  }

}
