import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-success',
  templateUrl: './create-success.page.html',
  styleUrls: ['./create-success.page.scss'],
})
export class CreateSuccessPage implements OnInit {

  // 生成二维码定义变量
  courseCode = '';
  createdCode = '';  //要生成的二维码内容变量
  flag = '0';

  constructor(private activatedRoute: ActivatedRoute,) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      
      if (queryParams.courseCode) {//班课详情
        this.flag = '1';
        this.courseCode = queryParams.courseCode;
        this.createdCode = queryParams.courseCode;
      } else {//新建班课
        this.flag = '0';
        this.courseCode = localStorage.getItem("create_courseCode");
        this.createdCode = localStorage.getItem("create_courseCode");
      }
    });
  }

}
