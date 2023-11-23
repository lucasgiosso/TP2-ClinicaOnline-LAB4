import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Auth } from '@angular/fire/auth';


export interface Horario {
  especialidad: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
}

@Injectable({
  providedIn: 'root',
})
export class EspecialistaService {
  private disponibilidadSubject = new BehaviorSubject<Horario[]>([]);
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
    const nuevaDisponibilidad = [...disponibilidadActual, nuevoHorario];
    this.disponibilidadSubject.next(nuevaDisponibilidad);

    this.actualizarDisponibilidadFirestore(nuevaDisponibilidad);
  }

  private async actualizarDisponibilidadFirestore(disponibilidad: Horario[]) {
    try {
      const user = this.auth.currentUser;

      if (user) {
        const userDocRef = doc(collection(this.firestore, 'DatosUsuarios'), user.uid);
        await updateDoc(userDocRef, { disponibilidad });
        const sortedDisponibilidad = disponibilidad.sort((a, b) => {
          const dayComparison = a.dia.localeCompare(b.dia);
          return dayComparison === 0 ? a.horaInicio.localeCompare(b.horaInicio) : dayComparison;
        });
        this.disponibilidadSubject.next(sortedDisponibilidad);

        console.log('Disponibilidad actualizada en Firestore.');
      }
    } catch (error) {
      console.error('Error al actualizar la disponibilidad en Firestore:', error);
    }
  }
  
}