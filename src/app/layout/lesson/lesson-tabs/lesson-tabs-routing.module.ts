import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonTabsPage } from './lesson-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: LessonTabsPage,
    children: [
      {
        path: 'member',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../member/member.module').then(m => m.MemberPageModule)
          }
        ]
      },
      // {
      //   path: 'activities',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../lesson/activities/activities.module').then(m => m.ActivitiesPageModule)
      //     }
      //   ]
      // },
      // {
      //   path: 'message',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../lesson/message/message.module').then(m => m.MessagePageModule)
      //     }
      //   ]
      // },
      {
        path: 'detail',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../detail/detail.module').then(m => m.DetailPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/lesson-tabs/member',
        pathMatch: 'full'
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonTabsPageRoutingModule {}
