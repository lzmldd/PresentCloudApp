import { SearchMemberComponent } from './components/search-member/search-member.component';
import { CheckinComponent } from './components/checkin/checkin.component';
import { SearchComponent } from './components/search/search.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [SearchComponent, CheckinComponent, SearchMemberComponent],
  imports: [
    CommonModule
  ],
  exports: [SearchComponent, CheckinComponent, SearchMemberComponent],
  entryComponents: [SearchComponent, CheckinComponent, SearchMemberComponent]
})
export class SharedModule { }
