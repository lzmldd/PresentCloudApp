import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MylessonPage } from './mylesson.page';

const routes: Routes = [
  {
    path: '',
    component: MylessonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MylessonPageRoutingModule {}
