import { HttpServiceService } from './../../../shared/services/http-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lesson-detail-edit',
  templateUrl: './lesson-detail-edit.page.html',
  styleUrls: ['./lesson-detail-edit.page.scss'],
})
export class LessonDetailEditPage implements OnInit {

  public property: any;
  public title: any;
  public pageNum: any;
  public value: "";
  constructor(private activatedRoute: ActivatedRoute,
    public router: Router,
    public httpService: HttpServiceService,
    // public http: HttpClient
    ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.property = queryParams.property;
      this.title = queryParams.title;
      this.pageNum = queryParams.pageNum;
      var api = '/course/manage/' + localStorage.getItem("course_id");
      this.httpService.getAll(api).then(async (response: any) => {
        if (this.pageNum == "1") {//学习要求
          this.value = response.data.obj.learnRequire;
        } else if (this.pageNum == "2") {//学习进度
          this.value = response.data.obj.teachProgress;
        } else if (this.pageNum == "3") {//考试安排
          this.value = response.data.obj.examSchedule;
        }
      })
    });
  }
  updateLesson(pageNum) {
    var params = {
      id: localStorage.getItem("course_id"),
    }
    if (pageNum == '1') {
      params["learnRequire"] = this.value;
    } else if (pageNum = '2') {
      params["teachProgress"] = this.value;
    } else if (pageNum == "3"){
      params["examSchedule"] = this.value;
    }
    console.log(params)
    var api = '/course/manage/'
    this.httpService.put(api, params).then(async (response: any) => {
      // console.log(response.data);
    })
  }

}

