import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckinResultPage } from './checkin-result.page';

const routes: Routes = [
  {
    path: '',
    component: CheckinResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckinResultPageRoutingModule {}
