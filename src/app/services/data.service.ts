import { Injectable } from "@angular/core";
import { UserService } from "./user.service";
import { UserCredential } from '@angular/fire/auth';
import { Firestore, addDoc, collection, getDoc, getDocs, updateDoc, setDoc, doc, query, where, orderBy, deleteDoc  } from '@angular/fire/firestore';
import { DocumentData, DocumentReference, getFirestore } from "firebase/firestore";
import Swal from "sweetalert2";


@Injectable()

export class DataServices{

constructor(private firestore: Firestore) {}

// cargarLogin() {
//   const firebaseCollection = 'userLogin';
//   const collectionRef = collection(this.firestore, firebaseCollection);

//   return getDocs(collectionRef);
// }

async cargarLogin() {
  const firebaseCollection = 'userLogin';
  const collectionRef = collection(this.firestore, firebaseCollection);

  const querySnapshot = await getDocs(collectionRef);
  
  const userData: any[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    userData.push(data);
  });

  console.log(userData);
  
  return userData;
}

guardarLogin(email: string | null, role: string | null) {

  const firebaseCollection = 'userLogin';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const loginDate = new Date().toLocaleDateString('es-ES', options);
  const loginData = {
    Usuario: email,
    Role: role,
    FechaIngreso: loginDate,
  };

  const collectionRef = collection(this.firestore, firebaseCollection);

  setDoc(doc(collectionRef), loginData)
    .then(() => {
      console.log('Inicio de sesión guardado en Firestore');
      console.log(loginData);
    })
    .catch((error: any) => {
      console.error('Error al guardar en Firestore: ', error);
    });
  }

  agregarHelado(coleccion: string, data: any) {
    const ref = collection(this.firestore, coleccion);
  
    return addDoc(ref, data)
      .then((docRef: DocumentReference) => {
        console.log('Documento agregado con ID: ', docRef.id);
  
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El helado se ha agregado correctamente.',
        });
      })
      .catch((error: any) => {
        console.error('Error al agregar el documento: ', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar el helado. Inténtalo de nuevo.',
        });
      });
  }

  async traerInfoHelados(coleccion: string): Promise<DocumentData[]> {
    const ref = collection(this.firestore, coleccion);
    const q = query(ref, orderBy('nombre'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data());
  }

  // traerInfoHelados(coleccion: string): Promise<DocumentData[]> {
  //   const ref = collection(this.firestore, coleccion);
  //   const q = query(ref, orderBy('nombre'));
  
  //   return getDocs(q)
  //     .then((querySnapshot) => {
  //       return querySnapshot.docs.map((doc) => doc.data());
  //     })
  //     .catch((error) => {
  //       console.error('Error al obtener los datos de Firebase:', error);
  //       throw error;
  //     });
  // }

  actualizarHelado(helado: any) {
    const heladosCollection = collection(this.firestore, 'helados');
    const q = query(heladosCollection, where('nombre', '==', helado.nombre));
  
    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            tipo: helado.tipo,
            peso: helado.peso,
            precio: helado.precio,
          })
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'El helado se ha actualizado correctamente.',
              });
            })
            .catch((error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el helado. Inténtalo de nuevo.',
              });
            });
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener los documentos. Inténtalo de nuevo.',
        });
      });
  }
  
  eliminarHelado(helado: any) {
    const heladosCollection = collection(this.firestore, 'helados');
    const q = query(heladosCollection, where('nombre', '==', helado.nombre));
  
    getDocs(q)
      .then((querySnapshot) => {
        let documentosEliminados = 0;
  
        querySnapshot.forEach((doc) => {
          if (documentosEliminados > 0) {
            return;
          }
  
          const data = doc.data();
          if (data['nombre'] === helado.nombre) {
            deleteDoc(doc.ref)
              .then(() => {
                documentosEliminados++;
                Swal.fire({
                  icon: 'success',
                  title: 'Éxito',
                  text: 'El helado se ha eliminado correctamente.',
                });
              })
              .catch((error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo eliminar el helado. Inténtalo de nuevo.',
                });
              });
          }
        });
  
        if (documentosEliminados === 0) {

        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener los documentos. Inténtalo de nuevo.',
        });
      });
  }

}