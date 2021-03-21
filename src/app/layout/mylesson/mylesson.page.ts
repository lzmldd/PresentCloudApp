import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mylesson',
  templateUrl: './mylesson.page.html',
  styleUrls: ['./mylesson.page.scss'],
})
export class MylessonPage implements OnInit {

  public tab = "tab1";
  public lessonName = '';
  public lessonNo = '';
  params = {}
  public result;
  api = '/courses';//后台接口
  public listThreshold = 7;

  public list = [];
  public list1 = [];
  public index = 0;
  public endflag = '0';
  public flag = '0';
  public lessonList = [{
    no: "",
    class: "",
    term: "",
    tname: "",
    name: ""
  }
  ];
  constructor() { }

  ngOnInit() {
  }

}
