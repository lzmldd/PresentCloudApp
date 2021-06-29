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
    schoolId: null,// 课程的学校id
    departmentId: null,// 课程的学院id
    flag: 1,// 是否学校课表班课，1代表是
    learnRequire: "未设置",// 学习要求
    teachProgress: "未设置",// 教学进度
    examSchedule: "未设置" // 考试安排
  }
  public markSchool = "true"
  public selectedName = "请选择"// 选择的学校院系名
  public selectedId = ""

  term = [[]];
  termOptions = 7;// 学期列表选项长度
  course = [[]];
  courseOptions: number;
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public httpService: HttpServiceService,
    public http: HttpClient,
    public alertController: AlertController,
    public toastController: ToastController,
    public pickerController: PickerController,
    public platform: Platform
  ) {
    // this.ngOnInit()
    activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.pageNum == '0') {
        // console.log(queryParams.name, queryParams.id)
        // console.log(queryParams.id.split("/")[1])
        this.selectedName = queryParams.name
        this.selectedId = queryParams.id
        localStorage.setItem("recent_selectedName", this.selectedName)
        localStorage.setItem("recent_selectedId", this.selectedId)
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
      } 
      // console.log(this.lesson)
    });
  }

  ngOnInit() {
    
    var api = '/course/manage/';//后台接口
    this.httpService.getAll(api).then(async (response: any) => {

      // this.courseList = response.data;
      for (var i = 0; i < response.data.length; i++) {
        this.course[0].push(response.data[i].name);
      }
      this.courseOptions = this.course[0].length;
    })
    this.lesson = {
      className: "",
      name: "",
      term: "",
      schoolId: null,// 课程的学校id
      departmentId: null,// 课程的学院id
      flag: 1,
      learnRequire: "未设置",
      teachProgress: "未设置",
      examSchedule: "未设置"
    }
    
    if (localStorage.getItem("recent_selectedName") != null) {
      this.selectedName = localStorage.getItem("recent_selectedName")
    }
    if (localStorage.getItem("recent_selectedId") != null) {
      this.selectedId = localStorage.getItem("recent_selectedId")
    }
    this.getTime();
    console.log(this.lesson.term)
  }

  onCreate(form: NgForm) {
    console.log(this.lesson.flag)
    if (form.valid) {
      if (this.lesson.flag) {
        this.lesson.flag = 1;
      } else {
        this.lesson.flag = 0;
      }
      // 更新lesson中的schoolId和departmentId
      this.lesson.schoolId = this.selectedId.split('/')[0]
      this.lesson.departmentId = this.selectedId.split('/')[1]
      var params = this.lesson;
      console.log(params)
      var api = '/course/mobile/teacher';//后台接口
      this.httpService.post(api, params).then(async (response: any) => {
        if (response.data.message == "创建班课成功") {
          const toast = await this.toastController.create({
            message: "创建班课成功",
            duration: 2000,
            mode: 'ios'
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
    var month = myDate.getMonth()+1;// getMonth()为0-11
    console.log(month)
    for (var i = 0; i < 3; i++) {
      var start = year + i - 1;
      var end = start + 1;
      this.term[0].push(start + "-" + end + "-1");
      this.term[0].push(start + "-" + end + "-2");
    }
    this.term[0].push("不设置学期")
    if (month >= 2 && month <= 7)// 2-7为第二学期
    {
      this.lesson.term= this.term[0][1]
    }
    else
    {
      this.lesson.term = this.term[0][2]
    }
  }

  // 点击学期弹出选项框
  async termPicker(numColumns = 1, numOptions, columnOptions) {

    const picker = await this.pickerController.create({
      columns: this.getTermColumns(numColumns, numOptions, columnOptions),
      mode:"ios",
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

}
