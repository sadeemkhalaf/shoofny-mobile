import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    ComponentsModule,
    SignupPageRoutingModule
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
