import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonEditPage } from './lesson-edit.page';

const routes: Routes = [
  {
    path: '',
    component: LessonEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonEditPageRoutingModule {}
