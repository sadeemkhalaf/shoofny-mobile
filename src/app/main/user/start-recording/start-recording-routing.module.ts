import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartRecordingPage } from './start-recording.page';

const routes: Routes = [
  {
    path: '',
    component: StartRecordingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartRecordingPageRoutingModule {}
