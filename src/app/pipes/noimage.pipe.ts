import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noimage'
})
export class NoimagePipe implements PipeTransform {
  transform(image: File, invalidImage: boolean = false): string {
    if (invalidImage || !image) {
      return 'assets/noimage.png'; 
    }

    // Devuelve la URL de la imagen válida
    return URL.createObjectURL(image);
  }
}