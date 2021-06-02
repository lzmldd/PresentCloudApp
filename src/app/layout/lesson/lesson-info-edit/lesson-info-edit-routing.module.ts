import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonInfoEditPage } from './lesson-info-edit.page';

const routes: Routes = [
  {
    path: '',
    component: LessonInfoEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonInfoEditPageRoutingModule {}
