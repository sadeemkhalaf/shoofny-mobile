import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListItemComponent } from '../job-list-item/job-list-item.component';
import { ProfileSummaryComponent } from '../profile-summary/profile-summary.component';
import { SearchBoxComponent } from '../search-box/search-box.component';

export const components = [
  JobListItemComponent,
  ProfileSummaryComponent,
  SearchBoxComponent
];

@NgModule({
  declarations: [
    components
  ],
  imports: [
    CommonModule
  ],   exports: [
    components
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  entryComponents: [
    components
  ]
})
export class ComponentsModule { }
