import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FillNewProfilePage } from './fill-new-profile.page';

const routes: Routes = [
  {
    path: '',
    component: FillNewProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FillNewProfilePageRoutingModule {}
