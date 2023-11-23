import { Injectable } from '@angular/core';
import { UserCredential, onAuthStateChanged, sendEmailVerification } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, fetchSignInMethodsForEmail } from '@angular/fire/auth';
import { DataServices } from './data.service';
import { Firestore, collection, getDoc, doc, updateDoc, query, getDocs, QuerySnapshot, where } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userData: any = {};
  private userRoleSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('userRole')
  );

  userRole$ = this.userRoleSubject.asObservable();

  constructor(private auth: Auth, private dataService:DataServices, private firestore: Firestore) { 
    
  }

  async register(email: string, password: string) {

      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      return userCredential;
  }

  checkIfUserExists(email: string) {
    return fetchSignInMethodsForEmail(this.auth, email)
      .then((signInMethods) => signInMethods && signInMethods.length > 0)
      .catch((error) => {
        console.error('Error al verificar el usuario:', error);
        return false;
      });
  }

  login({ email, password }: any) {

    return signInWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential: UserCredential) => {
        const user = userCredential.user;
  
        const userDocRef = doc(collection(this.firestore, 'DatosUsuarios'), user.uid);
  
        try {
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userRole = userData['role'];
  
            const aprobadoPorAdmin = userData['aprobadoPorAdmin'];
  
            if (!aprobadoPorAdmin) {

              throw new Error('La cuenta aún no ha sido aprobada por el administrador.');
            }
  
            this.userRoleSubject.next(userRole);
            localStorage.setItem('userRole', userRole);
            this.dataService.guardarLogin(email, userRole);
          } else {
            console.error('Documento de usuario no encontrado en Firestore');
          }
        } catch (error) {

          //console.error('Error al consultar Firestore:', error);
          throw error;
        }
  
        return userCredential;
      });
  }
  
  
  getRole(): string {
    return this.userData.userRole;
  }

  logout() 
  {
    return signOut(this.auth);
  }  

  getCurrentUser(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = this.auth.onAuthStateChanged((user: User | null) => {
        observer.next(user);
      });
      return () => {
        unsubscribe();
      };
    });
  }

  async aprobarUsuario(userId: string): Promise<void> {
    const userDocRef = doc(collection(this.firestore, 'DatosUsuarios'), userId);
    
    try {
      await updateDoc(userDocRef, {
        aprobadoPorAdmin: true
      });
  
      //console.log('Usuario aprobado exitosamente.');
    } catch (error) {
      console.error('Error al aprobar usuario:', error);
      throw error;
    }
  }

  async inhabilitarUsuario(userId: string): Promise<void> {
    const userDocRef = doc(collection(this.firestore, 'DatosUsuarios'), userId);
    
    try {
      await updateDoc(userDocRef, {
        aprobadoPorAdmin: false
      });
  
      //console.log('Usuario aprobado exitosamente.');
    } catch (error) {
      console.error('Error al aprobar usuario:', error);
      throw error;
    }
  }

  async obtenerUsuariosPendientesAprobacion(): Promise<any[]> {
    try {
      const usuariosQuery = query(
        collection(this.firestore, 'DatosUsuarios'),
        where('aprobadoPorAdmin', '==', false)
      );

      const querySnapshot: QuerySnapshot<any> = await getDocs(usuariosQuery);

      const usuarios: any[] = [];
      querySnapshot.forEach((doc) => {

        const usuario = {
          id: doc.id,
          ...doc.data(),
        };
        usuarios.push(usuario);
      });

      return usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios pendientes de aprobación:', error);
      throw error;
    }
  }

  async obtenerUsuarios(): Promise<any[]> {
    try {
      const usuariosQuery = query(
        collection(this.firestore, 'DatosUsuarios')
      );
  
      const querySnapshot: QuerySnapshot<any> = await getDocs(usuariosQuery);
  
      const usuarios: any[] = [];
      querySnapshot.forEach((doc) => {
  
        const usuario = {
          id: doc.id,
          ...doc.data(),
        };
        usuarios.push(usuario);
      });
  
      return usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  async obtenerInfoUsuarioActual(): Promise<any | null> {
    try {
        let usuarioActual: User | null = null;

        await new Promise<void>((resolve) => {
            const unsubscribe = onAuthStateChanged(this.auth, (user) => {
                usuarioActual = user;
                unsubscribe();
                resolve();
            });
        });

        if (usuarioActual) {

            const uid = (usuarioActual as User).uid;

            const userDocRef = doc(this.firestore, 'DatosUsuarios', uid);
            const usuarioDoc = await getDoc(userDocRef);

            if (usuarioDoc.exists()) {
                return {
                    id: usuarioDoc.id,
                    ...usuarioDoc.data(),
                };
            } else {
                console.error('El documento del usuario no existe.');
                return null;
            }
        } else {
            console.error('Usuario no autenticado.');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener información del usuario actual:', error);
        throw error;
    }
  }
}


