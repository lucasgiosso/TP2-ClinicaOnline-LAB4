import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';

import { DataServices } from '../app/services/data.service';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BienvenidaComponent } from './modules/general/bienvenida/bienvenida.component';
import { FirestoreModule, provideFirestore,getFirestore} from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedComponent } from './shared/shared.component';
import { UserService } from './services/user.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AdminGuard } from './guards/admin.guard';
import { PacienteGuard } from './guards/paciente.guard';
import { PacienteAdminGuard } from 'src/app/guards/paciente-admin.guard';
import { PacienteEspecialistaGuard } from 'src/app/guards/paciente-especialista.guard';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    SharedComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FirestoreModule,
    NgxCaptchaModule,
    HttpClientModule,
    AngularFireStorageModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
  ],
  providers: [DataServices, UserService, AdminGuard, PacienteGuard, PacienteAdminGuard,PacienteEspecialistaGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
