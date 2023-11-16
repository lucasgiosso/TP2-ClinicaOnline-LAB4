import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { NoimagePipe } from 'src/app/pipes/noimage.pipe';
import { NgxCaptchaModule } from 'ngx-captcha';


@NgModule({
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxCaptchaModule
  ],
  declarations: [
    RegisterComponent,
    NoimagePipe,
  ]
})
export class RegisterModule { }