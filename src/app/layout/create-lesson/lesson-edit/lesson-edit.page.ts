import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lesson-edit',
  templateUrl: './lesson-edit.page.html',
  styleUrls: ['./lesson-edit.page.scss'],
})
export class LessonEditPage implements OnInit {

  public property: any;
  public title: any;
  public pageNum: any;
  public value: "";// 输入的值
  constructor(private activatedRoute: ActivatedRoute,
    public router: Router,) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.property = queryParams.property;
      this.title = queryParams.title;
      this.pageNum = queryParams.pageNum;
    });
  }

  ngOnInit() {
  }

}
