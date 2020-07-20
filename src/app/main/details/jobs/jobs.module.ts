import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobsPageRoutingModule } from './jobs-routing.module';

import { JobsPage } from './jobs.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SearchBoxPipe } from 'src/app/providers/search-box.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    JobsPageRoutingModule
  ],
  declarations: [JobsPage, SearchBoxPipe]
})
export class JobsPageModule {}
