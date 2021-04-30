import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeTabsPage } from './home-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: HomeTabsPage,
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
      // {
      //   path: 'user-info',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../user/user-info/user-info.module').then(m => m.UserInfoPageModule)
      //     }
      //   ]
      // },
      {
        path: 'my',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../user/my/my.module').then(m => m.MyPageModule)
          }
        ]
      },
      {// 默认到班课页面
        path: '',
        redirectTo: '/home-tabs/mylesson',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTabsPageRoutingModule {}
