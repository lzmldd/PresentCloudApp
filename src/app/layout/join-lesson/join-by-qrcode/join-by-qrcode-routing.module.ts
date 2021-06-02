import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoinByQrcodePage } from './join-by-qrcode.page';

const routes: Routes = [
  {
    path: '',
    component: JoinByQrcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinByQrcodePageRoutingModule {}
