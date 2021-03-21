import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadChildren: () => import('./routes/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./routes/passport/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./routes/passport/forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./routes/passport/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./routes/passport/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'lesson-tabs',
    loadChildren: () => import('./layout/lesson-tabs/lesson-tabs.module').then( m => m.LessonTabsPageModule)
  },
  {
    path: 'mylesson',
    loadChildren: () => import('./layout/mylesson/mylesson.module').then( m => m.MylessonPageModule)
  },
  {
    path: 'user-inf',
    loadChildren: () => import('./layout/user/user-inf/user-inf.module').then( m => m.UserInfPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
