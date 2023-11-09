import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';

import { DataServices } from '../app/services/data.service';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BienvenidaComponent } from './modules/general/bienvenida/bienvenida.component';
import { FirestoreModule, provideFirestore,getFirestore} from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedComponent } from './shared/shared.component';


@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    SharedComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule
  ],
  providers: [DataServices],
  bootstrap: [AppComponent]
})
export class AppModule { }
