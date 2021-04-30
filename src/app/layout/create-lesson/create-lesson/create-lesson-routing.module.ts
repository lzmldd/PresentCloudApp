import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateLessonPage } from './create-lesson.page';

const routes: Routes = [
  {
    path: '',
    component: CreateLessonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateLessonPageRoutingModule {}
