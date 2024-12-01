import { Pipe, PipeTransform } from '@angular/core';
import { Asistente } from '../models/asistente.model';

@Pipe({
  name: 'filtroAsistentes'
})
export class FiltroAsistentesPipe implements PipeTransform {

  transform(asistentes: Asistente[], filtro: string): Asistente[] {
    if (!filtro) {
      return asistentes;
    }
    return asistentes.filter(asistente =>
      asistente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      asistente.domicilio.toLowerCase().includes(filtro.toLowerCase()) ||
      asistente.email.toLowerCase().includes(filtro.toLowerCase())
    );
  }

}
