import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./main/user/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./main/user/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./main/user/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./main/details/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'job-details',
    loadChildren: () => import('./main/details/job-details/job-details.module').then( m => m.JobDetailsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./main/details/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./main/details/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./main/details/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'jobs',
    loadChildren: () => import('./main/details/jobs/jobs.module').then( m => m.JobsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
