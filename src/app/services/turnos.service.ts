import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Turno {
  id: string,
  especialidad: string;
  especialista: string;
  estado: string;
  resena?: string; 
  encuestaRealizada?: boolean;
}

interface EncuestaRespuestas {
  respuestas: string[];
}


@Injectable({
  providedIn: 'root'
})


export class TurnosService {

  private apiUrl = 'tu-ruta-del-api';

  constructor(private http: HttpClient) { }

  obtenerTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/turnos`);
  }

  cancelarTurno(turnoId: number, motivo: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/turnos/${turnoId}/cancelar`, { motivo });
  }

  enviarEncuesta(turnoId: string, respuestas: EncuestaRespuestas): Observable<any> {
    const url = `${this.apiUrl}/turnos/${turnoId}/encuesta`;
    // Aquí puedes realizar la solicitud HTTP para enviar las respuestas al servidor
    return this.http.post(url, respuestas);
  }

  enviarCalificacion(turnoId: string, calificacion: number, comentario: string): Observable<any> {
    const url = `${this.apiUrl}/enviarCalificacion`; // Reemplaza con el endpoint real de tu API
    const body = { turnoId, calificacion, comentario };

    return this.http.post(url, body);
  }

}
