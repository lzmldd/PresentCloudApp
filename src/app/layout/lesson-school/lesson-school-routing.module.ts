import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonSchoolPage } from './lesson-school.page';

const routes: Routes = [
  {
    path: '',
    component: LessonSchoolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonSchoolPageRoutingModule {}
