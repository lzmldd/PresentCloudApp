import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoinByCodePage } from './join-by-code.page';

const routes: Routes = [
  {
    path: '',
    component: JoinByCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinByCodePageRoutingModule {}
