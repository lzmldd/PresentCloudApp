import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserInfPage } from './user-inf.page';

const routes: Routes = [
  {
    path: '',
    component: UserInfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserInfPageRoutingModule {}
