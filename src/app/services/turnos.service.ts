import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc, getDocs, query, where, CollectionReference, DocumentData, doc, getDoc, QuerySnapshot } from '@angular/fire/firestore';

interface Turno {
  id: string; 
  pacienteId: number;
  especialidad: string;
  especialista: string;
  fecha: Date;
  estado: 'pendiente' | 'cancelado' | 'realizado';
  paciente: {
    id: string;
    mail: string;
    nombre: string;
  }
  comentario?: string;
  resena?: string;
  encuestaRealizada?: boolean;
  calificacion?: number; 
  comentarioCalificacion?: string;
}

interface EncuestaRespuestas {
  respuestas: string[];
}


@Injectable({
  providedIn: 'root'
})


export class TurnosService {

  private turnos: any[] = [];
  private turnosCollection: CollectionReference<DocumentData>;
  constructor(private firestore: Firestore) {
    this.turnosCollection = collection(this.firestore, 'turnos');
   }

   async getTurnosByPaciente(pacienteId: number): Promise<Turno[]> {
    const pacienteIdString = pacienteId.toString();
    const turnosQuery = query(this.turnosCollection, where('paciente.id', '==', pacienteIdString));
    const turnosSnapshot = await getDocs(turnosQuery);
  
    return turnosSnapshot.docs.map(doc => doc.data() as Turno);
  }

  async obtenerTurnos(): Promise<any[]> {
    try {
      const turnosQuery = query(
        collection(this.firestore, 'turnos')
      );
  
      const querySnapshot: QuerySnapshot<any> = await getDocs(turnosQuery);
  
      const turnos: any[] = [];
      querySnapshot.forEach((doc) => {
  
        const turnos = {
          id: doc.id,
          ...doc.data(),
        };
        turnos.push(turnos);
      });
  
      return turnos;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  async solicitarTurno(
    pacienteId: number,
    especialidad: string,
    especialista: string,
    day: number,
    horario: string,

  ) {
    //const paciente = await this.obtenerInformacionPaciente(pacienteId);
    const nuevoTurno = {
      id: '',
      pacienteId,
      especialidad,
      especialista,
      // paciente: {
      //   id: pacienteId.toString(),
      //   mail: paciente.mail,
      //   nombre: paciente.nombre,
      // },
      fecha: new Date(day),
      estado: 'pendiente',
      horario,

    };

    try {
      const docRef = await addDoc(this.turnosCollection, nuevoTurno);
      console.log('Turno registrado con ID:', docRef.id);
      return nuevoTurno;
    } catch (error) {
      console.error('Error al registrar el turno:', error);
      throw new Error('Error al registrar el turno en Firestore.');
    }
  }

  // private async obtenerInformacionPaciente(pacienteId: number): Promise<{ mail: string, nombre: string }> {
  //   try {
  //     const userDocRef = doc(this.firestore, 'DatosUsuarios', pacienteId.toString());
  //     const userDoc = await getDoc(userDocRef);

  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       return { mail: userData.mail, nombre: userData.nombre };
  //     } else {
  //       throw new Error(`No se encontró información para el paciente con ID ${pacienteId}`);
  //     }
  //   } catch (error) {
  //     console.error('Error al obtener la información del paciente:', error);
  //     throw new Error('Error al obtener la información del paciente desde Firestore.');
  //   }
  // }
  
  async verificarDisponibilidad(
    especialista: string,
    fecha: Date,
    horaInicio: string,
    horaFin: string
  ) {
    try {
      const disponibilidadQuery = query(
        this.turnosCollection,
        where('especialista', '==', especialista),
        where('fecha', '==', fecha),
        where('horaInicio', '<', horaFin),
        where('horaFin', '>', horaInicio)
      );

      const disponibilidades = await getDocs(disponibilidadQuery);

      return disponibilidades.empty;
    } catch (error) {
      console.error('Error al verificar la disponibilidad:', error);
      throw new Error('Error al verificar la disponibilidad en Firestore.');
    }
  }

  cancelarTurno(turnoId: number, motivo: string) {
    const turno = this.turnos.find(t => t.id === turnoId);

    if (turno && !turno.realizado) {
      // Cancelar el turno y agregar un comentario de cancelación
      turno.realizado = true;
      turno.comentario = `Cancelado: ${motivo}`;
    }
  }

  obtenerResena(turnoId: number): string {
    const turno = this.turnos.find(t => t.id === turnoId);

    return turno ? turno.comentario : '';
  }

  completarEncuesta(turnoId: number, encuesta: string) {
    const turno = this.turnos.find(t => t.id === turnoId);

    if (turno && turno.realizado) {
      turno.encuesta = encuesta;
    }
  }

  calificarAtencion(turnoId: number, calificacion: number, comentario: string) {
    const turno = this.turnos.find(t => t.id === turnoId);

    if (turno && turno.realizado) {
      turno.calificacion = calificacion;
      turno.comentarioCalificacion = comentario;
    }
  }

}
