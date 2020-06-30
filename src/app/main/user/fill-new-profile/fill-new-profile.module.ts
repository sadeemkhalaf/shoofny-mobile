import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FillNewProfilePageRoutingModule } from './fill-new-profile-routing.module';

import { FillNewProfilePage } from './fill-new-profile.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicSelectableComponent, IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    IonicSelectableModule,
    FillNewProfilePageRoutingModule
  ],
  declarations: [FillNewProfilePage]
})
export class FillNewProfilePageModule {}
