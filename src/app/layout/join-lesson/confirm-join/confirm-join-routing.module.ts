import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmJoinPage } from './confirm-join.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmJoinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmJoinPageRoutingModule {}
