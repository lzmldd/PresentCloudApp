import { HttpServiceService } from './../../../shared/services/http-service.service';
import { NgForm } from '@angular/forms';
import { AlertController, PickerController, Platform, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.page.html',
  styleUrls: ['./create-lesson.page.scss'],
})
export class CreateLessonPage implements OnInit {

  lesson = {
    className: "",// 班级名
    name: "",// 课程名
    term: "",// 学期
    schoolId: "",// 课程的学校id
    flag: 1,// 是否学校课表班课，1代表是
    learnRequire: "未设置",// 学习要求
    teachProgress: "未设置",// 教学进度
    examSchedule: "未设置" // 考试安排
  }
  public markSchool = "true"
  public selectedName = "请选择"// 选择的学校名

  courseList: any;
  course = [[]];
  courseOptions: number;
  // tempCourse: any;
  term = [[]];
  termOptions = 7;// 学期列表选项长度
  mark: any;
  temp: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public httpService: HttpServiceService,
    public http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    public pickerController: PickerController,
    public platform: Platform
  ) {
    // this.ngOnInit()
    activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.pageNum == '0') {
        // console.log(queryParams.name, queryParams.id)
        // console.log(queryParams.id.split("/")[1])
        this.selectedName = queryParams.name
        this.lesson.schoolId = queryParams.id.split("/")[1]
        localStorage.setItem("recent_selectedName", this.selectedName)
      } else if (queryParams.pageNum == '1') {
        if (queryParams.property == undefined) {
          this.lesson.learnRequire = "未设置"
        }
        else
          this.lesson.learnRequire = queryParams.property; // 将输入的值赋给this.lesson
      } else if (queryParams.pageNum == '2') {
        if (queryParams.property == undefined) {
          this.lesson.teachProgress = "未设置"
        }
        else
          this.lesson.teachProgress = queryParams.property;
      } else if (queryParams.pageNum == '3') {
        if (queryParams.property == undefined) {
          this.lesson.examSchedule = "未设置"
        }
        else
          this.lesson.examSchedule = queryParams.property;
      } else {
        // if (queryParams.name != undefined) {
        //   this.lesson.name = queryParams.name;
        //   if (this.course[0][this.course.length - 1] != queryParams.name) {
        //     this.course[0].push(this.lesson.name);
        //     this.courseOptions++;
        //   }
        // }
      }
      // console.log(this.lesson)
    });
  }

  ngOnInit() {
    this.lesson = {
      className: "",
      name: "",
      term: "",
      schoolId: "",
      flag: 1,
      learnRequire: "未设置",
      teachProgress: "未设置",
      examSchedule: "未设置"
    }
    // console.log(localStorage.getItem("recent_selectedName"))
    // console.log(this.selectedName)
    if (localStorage.getItem("recent_selectedName") != null) {

      this.selectedName = localStorage.getItem("recent_selectedName")
    }
    this.getTime();
    // // 获取课程列表
    var api = '/course/manage/';//后台接口
    this.httpService.getAll(api).then(async (response: any) => {

      this.courseList = response.data.data;
      for (var i = 0; i < this.courseList.length; i++) {
        this.course[0].push(this.courseList[i].name);
      }
      this.courseOptions = this.course[0].length;
    })

  }

  onCreate(form: NgForm) {
    if (form.valid) {
      if (this.markSchool) {
        this.lesson.flag = 1;
      } else {
        this.lesson.flag = 0;
      }

      var params = this.lesson;
      console.log(params)
      var api = '/course/mobile/teacher';//后台接口
      this.httpService.post(api, params).then(async (response: any) => {
        if (response.data.message == "创建班课成功") {
          const toast = await this.toastController.create({
            message: "创建班课成功",
            duration: 2000
          });
          toast.present();
          localStorage.setItem("create_courseCode", response.data.obj.courseCode)
          this.router.navigateByUrl('/create-success');
        }
        
      })

    }
  }

  getTime() {
    let myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    for (var i = 0; i < 3; i++) {
      var start = year + i - 1;
      var end = start + 1;
      this.term[0].push(start + "-" + end + "-01");
      this.term[0].push(start + "-" + end + "-02");
    }
    this.term[0].push("不设置学期")
  }

  // 点击学期弹出选项框
  async termPicker(numColumns = 1, numOptions, columnOptions) {

    const picker = await this.pickerController.create({
      columns: this.getTermColumns(numColumns, numOptions, columnOptions),
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确认',
          handler: (value) => {
            this.lesson.term = value.col.text;
            console.log(this.lesson.term)
          }
        }
      ]
    });

    await picker.present();
  }

  getTermColumns(numColumns, numOptions, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col`,
        options: this.getTermColumnOptions(i, numOptions, columnOptions)
      });
    }

    return columns;
  }

  getTermColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      })
    }

    return options;
  }

  // 点击课程弹出选项框
  async coursePicker(numColumns = 1, numOptions, columnOptions) {

    const picker = await this.pickerController.create({
      columns: this.getCourseColumns(numColumns, numOptions, columnOptions),
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确认',
          handler: (value) => {
            // console.log(value.col.text);
            this.lesson.name = value.col.text;
          }
        }
      ]
    });

    await picker.present();
  }

  getCourseColumns(numColumns, numOptions, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col`,
        options: this.getCourseColumnOptions(i, numOptions, columnOptions)
      });
    }

    return columns;
  }

  getCourseColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      })
    }

    return options;
  }


}
