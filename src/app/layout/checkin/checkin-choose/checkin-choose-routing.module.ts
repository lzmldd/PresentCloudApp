import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckinChoosePage } from './checkin-choose.page';

const routes: Routes = [
  {
    path: '',
    component: CheckinChoosePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckinChoosePageRoutingModule {}
