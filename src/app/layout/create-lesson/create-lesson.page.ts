import { NgForm } from '@angular/forms';
import { AlertController, PickerController, Platform, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpServiceService } from './../../shared/services/http-service.service';
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
    schoolId: "",
    flag: 1,// 是否学校课表班课，1代表是
    learnRequire: "未设置",// 学习要求
    teachProgress: "未设置",// 教学进度
    examSchedule: "未设置" // 考试安排
  }
  public markSchool = "true"
  school = [[]]// 学校名列表
  academy = [[]]// 学院名列表
  schoolList = {}// 学校列表
  academyList = {}// 学院列表
  public flag = 0;
  public selectedSchoolName = "请选择"// 选择的学校名
  public selectedAcademyName = "请选择"// 选择的学院名
  public schoolId;// 选择的学校id
  public academyId;// 选择的学院id
  public schoolOptions = 0;// 学校列表选项长度
  public academyOptions = 0;// 学院列表选项长度
  selectedSchoolCode: any;// 选择的学校code
  // selectedAcademy: string;
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

      if (queryParams.pageNum == '1') {
        if (queryParams.property == undefined)
        {
          this.lesson.learnRequire="未设置"
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
    this.getTime();
    // // 获取课程列表
    var api = '/dcloud/course/manage/';//后台接口
    this.httpService.getAll(api).then(async (response: any) => {

      this.courseList = response.data.data;
      for (var i = 0; i < this.courseList.length; i++) {
        this.course[0].push(this.courseList[i].name);
      }
      this.courseOptions = this.course[0].length;
    })

    // 获取学校列表
    this.school[0].length = 0;
    var api = '/dcloud/school/manage/tree';//后台接口
    this.httpService.getAll(api).then(async (response: any) => {

      this.schoolList = response.data;
      for (var i = 0; i < response.data.length; i++) {
        this.school[0].push(response.data[i].name);
      }
      this.schoolOptions = this.school[0].length;
      // console.log(this.schoolOptions)
      // console.log(this.schoolList)
      console.log(this.school)
    })
  }

  // 点击学校或学院弹出选项框
  // isSchool=1、0代表学校、学院选项框
  async openPicker(numColumns = 1, numOptions, multiColumnOptions, isSchool) {
    if (isSchool != 1 && this.lesson.schoolId.length == 0) {
      const alert = await this.alertController.create({
        header: '警告',
        message: '请先选择学校！',
        buttons: ['确认']
      });
      await alert.present();
    } else {
      const picker = await this.pickerController.create({
        columns: this.getColumns(numColumns, numOptions, multiColumnOptions, isSchool),
        buttons: [
          {
            text: '取消',
            role: 'cancel'
          },
          {
            text: '确认',
            handler: (value) => { // value 为选择的值
              var selected = this.getColumns(numColumns, numOptions, multiColumnOptions, isSchool); // 选择的选项框，如学校 学院
              if (isSchool == 1) {
                this.flag = 1;
                this.schoolId = selected[0].options[value.col.value].schoolId;// 选择的学校id
                this.selectedSchoolName = value.col.text;// 选择的学校名
                this.selectedSchoolCode = selected[0].options[value.col.value].schoolCode;// 选择的学校code
                this.lesson.schoolId = "";
                this.lesson.schoolId += this.schoolId;
                // console.log(selected)
                // console.log(value)
                // console.log(this.schoolId)
                // console.log(this.selectedSchoolName)
                // console.log(this.selectedSchoolCode)
                // console.log(this.lesson.school)
                
                //获取学院列表
                this.academy[0].length = 0;
                this.selectedAcademyName = '请选择';
                var params = {
                  id: this.schoolId
                };
                // var api = '/dcloud/school/manage/department/';//后台接口
                var api = '/dcloud/school/manage/tree';//后台接口
                this.httpService.get(api,params).then(async (response: any) => {
                  for (var i = 0; i < response.data.length; i++) {
                    // console.log(response.data[i].id == this.schoolId)
                    if (response.data[i].id == this.schoolId)// 比对学校code跟选择的学校code是否相同
                    {
                      for (var j = 0; j < response.data[i].departments.length; j++)// 将该学校下的院系名放入this.academy[0]
                      {
                        this.academy[0].push(response.data[i].departments[j].name);
                      }
                      break;
                    }
                  }
                  this.academyList = response.data[i].departments;
                  this.academyOptions = this.academy[0].length;
                  // console.log(this.academyList)
                  console.log(this.academy)
                })
              } else {
                this.flag++;//2
                if (this.flag > 2) {
                  this.flag--;
                  this.lesson.schoolId = this.schoolId;// 重新选择学院
                }
                if (this.lesson.schoolId.length == 0) {
                  console.log("请先选择学校");
                } else {// 选择学院
                  this.academyId = selected[0].options[value.col.value].academyId;// 选择的学院id
                  this.selectedAcademyName = value.col.text;// 选择的学院名
                  // this.lesson.school += "/" + this.academyId;
                  // console.log(selected)
                  // console.log(value)
                  // console.log(this.selectedAcademyName)
                  // console.log(this.academyId)
                  // console.log(this.lesson.school)
                }

              }
            }
          }
        ]
      });
      await picker.present();
    }
  }

  getColumns(numColumns, numOptions, columnOptions, isSchool) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col`,
        options: this.getColumnOptions(i, numOptions, columnOptions, isSchool)
      });
    }
    return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions, isSchool) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      if (isSchool == 1) {// 学校列表
        for (let j = 0; j < this.schoolOptions; j++) {
          if (this.schoolList[j].name == columnOptions[columnIndex][i % numOptions]) {
            options.push({
              text: columnOptions[columnIndex][i % numOptions],// 学校名
              value: i,
              schoolCode: this.schoolList[j].schoolCode,// 学校code
              schoolId: this.schoolList[j].id// 学校id
            })
          }
        }
      } else {// 学院列表
        for (let j = 0; j < this.academyOptions; j++) {
          if (this.academyList[j].name == columnOptions[columnIndex][i % numOptions]) {
            options.push({
              text: columnOptions[columnIndex][i % numOptions],// 学院名
              value: i,
              // code: this.academyList[j].code,
              academyId: this.academyList[j].id// 学院id
            })
          }
        }
      }
    }
    return options;
  }

  onCreate(form: NgForm) {
    if (form.valid) {
      if (this.markSchool) {
        this.lesson.flag = 1;
      } else {
        this.lesson.flag = 0;
      }
      
      var params=this.lesson;
      console.log(params)
      var api = '/dcloud/course/mobile/teacher';//后台接口
      this.httpService.post(api, params).then(async (response: any) => {
        // console.log(response.data);
        localStorage.setItem("courseCode", response.data.obj.courseCode)
        const alert = await this.alertController.create({
          // header: '创建班课成功',
          message: '创建班课成功！',
          buttons: [
            {
              text: '确认',
              cssClass: 'secondary',
              handler: (blah) => {

                this.router.navigateByUrl('/create-success');
              }
            }
          ]
        });
        await alert.present();
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

  toAdd() {
    this.router.navigateByUrl('/add-lesson-name');
    localStorage.setItem("isCreate", '1');
  }

}
