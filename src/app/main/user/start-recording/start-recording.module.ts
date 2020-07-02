import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartRecordingPageRoutingModule } from './start-recording-routing.module';

import { StartRecordingPage } from './start-recording.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartRecordingPageRoutingModule
  ],
  declarations: [StartRecordingPage]
})
export class StartRecordingPageModule {}
