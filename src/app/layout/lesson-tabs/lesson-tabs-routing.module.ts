import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonTabsPage } from './lesson-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: LessonTabsPage,
    children: [
      {
        path: 'mylesson',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../mylesson/mylesson.module').then(m => m.MylessonPageModule)
          }
        ]
      },
      {
        path: 'user-inf',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../user/user-inf/user-inf.module').then(m => m.UserInfPageModule)
          }
        ]
      },
      {// 默认到班课页面
        path: '',
        redirectTo: '/lesson-tabs/mylesson',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonTabsPageRoutingModule {}
