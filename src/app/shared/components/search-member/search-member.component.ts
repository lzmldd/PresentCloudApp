import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavParams } from '@ionic/angular';

import { HttpServiceService } from '../../services/http-service.service';

@Component({
  selector: 'app-search-member',
  templateUrl: './search-member.component.html',
  styleUrls: ['./search-member.component.scss'],
})
export class SearchMemberComponent implements OnInit {

  public searchMember = []
  public flag: any = '0';
  public member = [];
  public memberNumber: any = 0;
  constructor(public navParams: NavParams,
    public httpService: HttpServiceService,
    public router: Router,
    public loadingController: LoadingController,) { }

  ngOnInit() { }

  dissmissSearch() {
    this.navParams.data.modal.dismiss();
  }

  async getData($event) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    //传给后台搜索的内容
    var params = {
      id: localStorage.getItem("course_id"),
      search: $event.detail.value,
      sortBy: "exp"//按经验值顺序显示
    }
    var api = '/course/mobile/member';//后台接口
    this.httpService.get(api, params).then(async (response: any) => {

      await loading.dismiss();
      if (response.data.length == 0) {
        this.flag = '0';
      } else {
        this.flag = '1';
        this.member = response.data;
        this.memberNumber = this.member.length;
        
      }
    })
  }

  gotoStudentCheckinResult(uid)
  {
    this.router.navigate(['student-checkin-result'], {
      queryParams: { historyFlag: '1', sid: uid }
    });
    this.dissmissSearch()
  }

}
