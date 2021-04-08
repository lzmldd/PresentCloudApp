import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.page.html',
  styleUrls: ['./create-lesson.page.scss'],
})
export class CreateLessonPage implements OnInit {
  
  lesson = {
    class: "",
    name: "请选择",
    term: "未设置",
    school: "",
    isSchoolLesson: "",
    require: "未设置",
    process: "未设置",
    examination: "未设置"
  }
  public markSchool = "true"
  school = [[]]
  academy = [[]]
  schoolList = {}
  academyList = {}
  public flag = 0;
  public schoolChoosed = "请选择"
  public academyChoosed = "请选择"
  public academyId;
  public schoolOptions = 0;
  public academyOptions = 0;
  selectedSchool: any;
  selectedAcademy: string;
  // courseList: any;
  course = [[]];
  tempCourse: any;
  term = [[]];
  termOptions = 12;
  courseOptions: number;
  mark: any;
  temp: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  toAdd(){
    this.router.navigateByUrl('/add-lesson');
    localStorage.setItem("isCreate",'1');
  }
}
