import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListItemComponent } from './job-list-item/job-list-item.component';
import { ProfileSummaryComponent } from './profile-summary/profile-summary.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { ProfilePictureCircleComponent } from './profile-picture-circle/profile-picture-circle.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeLanguageComponent } from './change-language/change-language.component';

export const components = [
  JobListItemComponent,
  ProfileSummaryComponent,
  SearchBoxComponent,
  ProfilePictureCircleComponent,
  BackButtonComponent,
  ChangeLanguageComponent
];

@NgModule({
  declarations: [
    components
  ],
  imports: [
    TranslateModule,
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
