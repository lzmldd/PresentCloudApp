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
    path: 'login',
    loadChildren: () => import('./routes/passport/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./routes/passport/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./routes/passport/forget-password/forget-password.module').then(m => m.ForgetPasswordPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./routes/passport/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  
  {
    path: 'home-tabs',
    loadChildren: () => import('./layout/home/home-tabs/home-tabs.module').then(m => m.HomeTabsPageModule)
  },
  {
    path: 'mylesson',
    loadChildren: () => import('./layout/home/mylesson/mylesson.module').then(m => m.MylessonPageModule)
  },
  {
    path: 'my',
    loadChildren: () => import('./layout/home/user/my/my.module').then(m => m.MyPageModule)
  },
  {
    path: 'user-info',
    loadChildren: () => import('./layout/home/user/user-info/user-info.module').then(m => m.UserInfoPageModule)
  },
  
  {
    path: 'create-lesson',
    loadChildren: () => import('./layout/create-lesson/create-lesson/create-lesson.module').then( m => m.CreateLessonPageModule)
  },
  {
    path: 'lesson-school',
    loadChildren: () => import('./layout/create-lesson/lesson-school/lesson-school.module').then(m => m.LessonSchoolPageModule)
  },
  {
    path: 'lesson-edit',
    loadChildren: () => import('./layout/create-lesson/lesson-edit/lesson-edit.module').then(m => m.LessonEditPageModule)
  },
  {
    path: 'create-success',
    loadChildren: () => import('./layout/create-lesson/create-success/create-success.module').then(m => m.CreateSuccessPageModule)
  },

  {
    path: 'checkin-choose',
    loadChildren: () => import('./layout/checkin/checkin-choose/checkin-choose.module').then( m => m.CheckinChoosePageModule)
  },
  {
    path: 'checkin',
    loadChildren: () => import('./layout/checkin/checkin/checkin.module').then(m => m.CheckinPageModule)
  },
  {
    path: 'checkin-result',
    loadChildren: () => import('./layout/checkin/checkin-result/checkin-result.module').then( m => m.CheckinResultPageModule)
  },
  
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
