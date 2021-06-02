import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinByCodePageRoutingModule } from './join-by-code-routing.module';

import { JoinByCodePage } from './join-by-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinByCodePageRoutingModule
  ],
  declarations: [JoinByCodePage]
})
export class JoinByCodePageModule {}
