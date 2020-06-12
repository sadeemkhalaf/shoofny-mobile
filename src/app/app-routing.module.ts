import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardsGuard } from './guards/auth-guards.guard';

const routes: Routes = [
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
    path: 'home',
    loadChildren: () => import('./main/details/home/home.module').then( m => m.HomePageModule)
    , canActivate: [AuthGuardsGuard]
  },
  {
    path: 'home/profile',
    loadChildren: () => import('./main/details/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'home/settings',
    loadChildren: () => import('./main/details/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'home/profile/edit-profile',
    loadChildren: () => import('./main/details/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'home/jobs',
    loadChildren: () => import('./main/details/jobs/jobs.module').then( m => m.JobsPageModule)
    },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
