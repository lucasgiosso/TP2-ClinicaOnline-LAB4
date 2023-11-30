import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Auth } from '@angular/fire/auth';


export interface Horario {
  id: number;
  especialidad: string;
  dias: string;
  horaInicio: string;
  horaFin: string;
}

interface TurnoDisponible {
  id: number;
  dias: string[];
  horaInicio: string;
  horaFin: string;
}


@Injectable({
  providedIn: 'root',
})
export class EspecialistaService {
  disponibilidadSubject = new BehaviorSubject<Horario[]>([]);
  disponibilidad$ = this.disponibilidadSubject.asObservable();



  constructor(private auth: Auth, private firestore: Firestore){
    this.cargarDisponibilidad();
  }

  async cargarDisponibilidad() {
    try {
      const user = this.auth.currentUser;

      if (user) {
        const userDocRef = doc(collection(this.firestore, 'DatosUsuarios'), user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData: { disponibilidad?: Horario[] } = userDoc.data();
          const disponibilidad = userData['disponibilidad'] || [];
          this.disponibilidadSubject.next(disponibilidad);
        }
      }
    } catch (error) {
      console.error('Error al cargar la disponibilidad desde Firestore:', error);
    }
  }

  guardarDisponibilidad(nuevoHorario: Horario) {
    const disponibilidadActual = this.disponibilidadSubject.value;
    nuevoHorario.id = disponibilidadActual.length + 1;
    const nuevaDisponibilidad = [...disponibilidadActual, nuevoHorario];
    this.disponibilidadSubject.next(nuevaDisponibilidad);

    this.actualizarDisponibilidadFirestore(nuevaDisponibilidad);
  }

  modificarDisponibilidad(idHorario: number, nuevoHorario: Horario) {
    console.log('Modificando horario con ID:', idHorario);
    const disponibilidadActual = this.disponibilidadSubject.value;
    const indice = disponibilidadActual.findIndex((h) => h.id === idHorario);
  
    if (indice !== -1) {
      const nuevaDisponibilidad = [...disponibilidadActual];
      nuevaDisponibilidad[indice] = nuevoHorario;
      console.log('Nueva disponibilidad emitida:', nuevaDisponibilidad);
      this.disponibilidadSubject.next(nuevaDisponibilidad);
  
      this.actualizarDisponibilidadFirestore(nuevaDisponibilidad);
    }
  }

  private async actualizarDisponibilidadFirestore(disponibilidad: Horario[]) {
    try {
      const user = this.auth.currentUser;

      if (user) {

        const disponibilidadConDiasArray = disponibilidad.map(item => ({ ...item, dias: Array.isArray(item.dias) ? item.dias : [item.dias] }));

        const userDocRef = doc(collection(this.firestore, 'DatosUsuarios'), user.uid);
        await updateDoc(userDocRef, { disponibilidad: disponibilidadConDiasArray });

        const sortedDisponibilidad = disponibilidad.sort((a, b) => {
          const dayComparison = a.dias[0].localeCompare(b.dias[0]);
          return dayComparison === 0 ? a.horaInicio.localeCompare(b.horaInicio) : dayComparison;
        });
        
        this.disponibilidadSubject.next(sortedDisponibilidad);

        console.log('Disponibilidad actualizada en Firestore.');
      }
    } catch (error) {
      console.error('Error al actualizar la disponibilidad en Firestore:', error);
    }
  }

  async obtenerTurnosDisponiblesParaEspecialista(especialistaId: string): Promise<TurnoDisponible[]> {
    try {
      const especialistaDocRef = doc(collection(this.firestore, 'DatosUsuarios'), especialistaId);
      const especialistaDoc = await getDoc(especialistaDocRef);

      if (especialistaDoc.exists()) {
        const { disponibilidad } = especialistaDoc.data();

        if (Array.isArray(disponibilidad)) {
          // Mapeamos la disponibilidad para asegurarnos de que tenga la estructura adecuada
          const turnosDisponibles: TurnoDisponible[] = disponibilidad.map((item: any) => ({
            id: item.id,
            dias: item.dias,
            horaInicio: item.horaInicio,
            horaFin: item.horaFin,
          }));

          return turnosDisponibles;
        } else {
          console.error('El campo disponibilidad no es un array.');
          return [];
        }
      } else {
        console.warn('No se encontró el documento del especialista con ID:', especialistaId);
        return [];
      }
    } catch (error) {
      console.error('Error al obtener los turnos disponibles:', error);
      return [];
    }
  }
}



