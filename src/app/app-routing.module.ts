import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardsGuard } from './guards/auth-guards.guard';
import { DataResolverService } from './resolvers/data-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./main/details/home/home.module').then( m => m.HomePageModule)
    , canActivate: [AuthGuardsGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'login',
    loadChildren: () => import('./main/user/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./main/user/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
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
    resolve: {
      query: DataResolverService
    },
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./main/details/jobs/jobs.module').then( m => m.JobsPageModule)
    },
    {
      path: 'signup',
      loadChildren: () => import('./main/user/signup/signup.module').then( m => m.SignupPageModule)
    },
  {
    path: 'signup/profile',
    loadChildren: () => import('./main/user/fill-new-profile/fill-new-profile.module').then( m => m.FillNewProfilePageModule)
  },
  {
    path: 'start-recording',
    loadChildren: () => import('./main/user/start-recording/start-recording.module').then( m => m.StartRecordingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
