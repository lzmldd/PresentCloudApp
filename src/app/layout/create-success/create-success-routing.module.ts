import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateSuccessPage } from './create-success.page';

const routes: Routes = [
  {
    path: '',
    component: CreateSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSuccessPageRoutingModule {}
