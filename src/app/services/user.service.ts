import { Injectable } from '@angular/core';
import { UserCredential, sendEmailVerification } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, fetchSignInMethodsForEmail } from '@angular/fire/auth';
import { DataServices } from './data.service';
import { Firestore, collection, getDoc, doc } from '@angular/fire/firestore';

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

  // async register(email: string, password: string) 
  // {
  //   const user = await createUserWithEmailAndPassword(this.auth,email, password);
  //   return await signInWithEmailAndPassword(this.auth,email, password);
  // }

  async register(email: string, password: string) {

      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      //const user = userCredential.user;      
  
      return userCredential;

      // if (user && user.emailVerified) {
      //   return userCredential;
      // } 
      // else {

      //   await sendEmailVerification(user);
  
      //   await signOut(this.auth);
  
      //   throw new Error('Debes verificar tu correo electrónico antes de iniciar sesión.');
      // }
  }

  checkIfUserExists(email: string) {
    return fetchSignInMethodsForEmail(this.auth, email)
      .then((signInMethods) => signInMethods && signInMethods.length > 0)
      .catch((error) => {
        console.error('Error al verificar el usuario:', error);
        return false;
      });
  }

  login({ email, password }: any) 
  {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential: UserCredential) => {
        const user = userCredential.user;

        const userDocRef = doc(collection(this.firestore, 'DatosUsuarios'), user.uid);

        getDoc(userDocRef)
          .then((userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const userRole = userData['role'];
              this.userRoleSubject.next(userRole);
              localStorage.setItem('userRole', userRole);
              this.dataService.guardarLogin(email, userRole);
            } 
        
            else {

              console.error('Documento de usuario no encontrado en Firestore');
            }
          })
          .catch((error) => {

            console.error('Error al consultar Firestore:', error);
          });
  
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

}
