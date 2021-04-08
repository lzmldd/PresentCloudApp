import { HttpClient } from '@angular/common/http';
import { HttpServiceService } from './../../services/http-service.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  // lesson-type='我创建的';
  lessonType: string = '我创建的';
  public isTeacher = '1';
  public content = '';
  public lessonList = [];
  public flag = '0';

  constructor(public navParams: NavParams,
    public router: Router,
    public httpService: HttpServiceService,
    public http: HttpClient,
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
  getData($event) {
    //传给后台搜索的内容
    var api = '/courses';//后台接口
    var params = {}
    if (this.isTeacher == '1') {
      params = {
        search: $event.detail.value,
        teacher_email: localStorage.getItem("email")
      }
    } else {
      params = {
        search: $event.detail.value,
        student_email: localStorage.getItem("email")
      }
    }

    this.httpService.get(api, params).then((response: any) => {
      if (response.data.length == 0) {
        this.flag = '0';
      } else {
        this.flag = '1';
      }
      this.lessonList = response.data;
    })
  }

  ngOnInit() { }

  getCurrentLesson(index) {
    this.dissmissSearch();
    console.log(this.lessonList[index])
    localStorage.setItem("lesson_name", this.lessonList[index].name);
    localStorage.setItem("lesson_no", this.lessonList[index].no);
    if (this.isTeacher == "1") {
      localStorage.setItem("isTeacher", '1');
    } else {
      localStorage.setItem("isTeacher", '0');
    }
    this.router.navigateByUrl("/tabs/member")
  }

  gotoCheckin(index) {
    this.dissmissSearch();
    localStorage.setItem("lesson_name", this.lessonList[index].name);
    localStorage.setItem("lesson_no", this.lessonList[index].no);
    this.router.navigateByUrl('/choose');
  }
}
