import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentCheckinResultPage } from './student-checkin-result.page';

const routes: Routes = [
  {
    path: '',
    component: StudentCheckinResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentCheckinResultPageRoutingModule {}
