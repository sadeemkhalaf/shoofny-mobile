import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartRecordingPageRoutingModule } from './start-recording-routing.module';

import { StartRecordingPage } from './start-recording.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    StartRecordingPageRoutingModule
  ],
  declarations: [StartRecordingPage]
})
export class StartRecordingPageModule {}
