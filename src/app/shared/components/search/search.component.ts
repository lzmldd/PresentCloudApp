import { HttpClient } from '@angular/common/http';
import { HttpServiceService } from './../../services/http-service.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavParams, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  
  lessonType: string = '我创建的';
  public isTeacher = '1';
  public flag = '0';
  public lessonList = [];
  
  constructor(public navParams: NavParams,
    public router: Router,
    public httpService: HttpServiceService,
    public http: HttpClient,
    public loadingController: LoadingController,
    )
    {
    if (navParams.data.type == 'join') {
      this.isTeacher = '0';
      this.lessonType = "我加入的";
    }
  }
  dissmissSearch() {
    this.navParams.data.modal.dismiss();
  }
  async getData($event) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    //传给后台搜索的内容
    var params = {}
    if (this.isTeacher == '1') {
      var api = '/course/mobile/teacher';//后台接口
      params = {
        search: $event.detail.value,
      }
    } else {
      var api = '/course/mobile/student';//后台接口
      params = {
        search: $event.detail.value,
      }
    }

    this.httpService.get(api,params).then(async (response: any) => {
      await loading.dismiss();
      if (response.data.length == 0) {
        this.flag = '0';
      } else {
        this.flag = '1';
      }
      this.lessonList = response.data.data;
    })
  }

  ngOnInit() { }

  getCurrentLesson(index) {
    this.dissmissSearch();
    console.log(this.lessonList[index])
    localStorage.setItem("select_lessonName", this.lessonList[index].name);
    localStorage.setItem("select_courseCode", this.lessonList[index].courseCode);
    if (this.isTeacher == "1") {
      localStorage.setItem("isTeacher", '1');
    } else {
      localStorage.setItem("isTeacher", '0');
    }
    this.router.navigateByUrl("/tabs/member")
  }

  gotoCheckin(index) {
    this.dissmissSearch();
    localStorage.setItem("select_lessonName", this.lessonList[index].name);
    localStorage.setItem("select_courseCode", this.lessonList[index].courseCode);
    this.router.navigateByUrl('/choose');
  }
}
