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
  schoolList = {}// 学校列表
  academyList = {}
  public flag = 0;
  public schoolChoosed = "请选择"
  public academyChoosed = "请选择"
  public academyId;
  public schoolOptions = 0;// 学校列表长度
  public academyOptions = 0;
  selectedSchool: any;
  selectedAcademy: string;
  courseList: any;
  course = [[]];
  tempCourse: any;
  term = [[]];
  termOptions = 12;
  courseOptions: number;
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
    activatedRoute.queryParams.subscribe(queryParams => {

      if (queryParams.pageNum == '1') {
        this.lesson.require = queryParams.property;
      } else if (queryParams.pageNum == '2') {
        this.lesson.process = queryParams.property;
      } else if (queryParams.pageNum == '3') {
        this.lesson.examination = queryParams.property;
      } else {
        if (queryParams.name != undefined) {
          this.lesson.name = queryParams.name;
          if (this.course[0][this.course.length - 1] != queryParams.name) {
            this.course[0].push(this.lesson.name);
            this.courseOptions++;
          }
        }
      }
    });
  }

  ngOnInit() {
    this.getTime();
    //请求后台数据
    var api = '/dcloud/course/manage';//后台接口
    this.httpService.getAll(api).then(async (response: any) => {

      this.courseList = response.data.data;
      for (var i = 0; i < this.courseList.length; i++) {
        this.course[0].push(this.courseList[i].name);
      }
      this.courseOptions = this.course[0].length;
    })

    this.school[0].length = 0;
    //获取学校列表
    var api = '/dcloud/school/manage/tree';//后台接口
    this.httpService.getAll(api).then(async (response: any) => {

      this.schoolList = response.data;
      for (var i = 0; i < response.data.length; i++) {
        this.school[0].push(response.data[i].name);
        
      }
      this.schoolOptions = this.school[0].length;
      // console.log(this.schoolOptions)
      console.log(this.school)
    })
  }

  // 点击学校或学院弹出选项框
  // isSchool=1、0代表学校、学院选项框
  async openPicker(numColumns = 1, numOptions, multiColumnOptions, isSchool) {
    if (isSchool != 1 && this.lesson.school.length == 0) {
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
            handler: (value) => {
              var selected = this.getColumns(numColumns, numOptions, multiColumnOptions, isSchool);
              if (isSchool == 1) {
                this.flag = 1;
                this.academyId = selected[0].options[value.col.value].id;
                this.schoolChoosed = value.col.text;
                this.lesson.school = "";
                this.selectedSchool = selected[0].options[value.col.value].code;
                this.lesson.school += this.selectedSchool;
                console.log(this.schoolChoosed)
                //获取学院列表
                this.academy[0].length = 0;
                var param = {
                  academy: this.academyId,
                }
                this.academyChoosed = '未设置';
                var api = '/dcloud/school/manage/tree';//后台接口
                this.httpService.get(api, param).then(async (response: any) => {
                  for (var i = 0; i < response.data.length; i++) {
                    this.academy[0].push(response.data[i].name);
                  }
                  this.academyList = response.data;
                  this.academyOptions = this.academy[0].length;
                })
              } else {
                this.flag++;//2
                if (this.flag > 2) {
                  this.flag--;
                  this.lesson.school = this.selectedSchool;
                }
                if (this.lesson.school.length == 0) {
                  console.log("请先选择学校");
                } else {
                  this.academyChoosed = value.col.text;
                  this.selectedAcademy = selected[0].options[value.col.value].code;
                  this.lesson.school += "/" + this.selectedAcademy;
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
      if (isSchool == 1) {
        for (let j = 0; j < this.schoolOptions; j++) {
          if (this.schoolList[j].name == columnOptions[columnIndex][i % numOptions]) {
            options.push({
              text: columnOptions[columnIndex][i % numOptions],
              value: i,
              code: this.schoolList[j].code,
              id: this.schoolList[j].id
            })
          }
        }
      } else {
        for (let j = 0; j < this.academyOptions; j++) {
          if (this.academyList[j].name == columnOptions[columnIndex][i % numOptions]) {
            options.push({
              text: columnOptions[columnIndex][i % numOptions],
              value: i,
              code: this.academyList[j].code,
              id: this.academyList[j].id
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
        this.lesson.isSchoolLesson = "1";
      } else {
        this.lesson.isSchoolLesson = "0";
      }
      var params = this.lesson;
      params["email"] = localStorage.getItem("email");
      var api = '/courses';//后台接口
      this.httpService.post(api, params).then(async (response: any) => {
        // console.log(response.data);
        localStorage.setItem("create-code", response.data)
        const alert = await this.alertController.create({
          // header: '创建班课成功',
          message: '创建班课成功！',
          buttons: [
            {
              text: '确认',
              cssClass: 'secondary',
              handler: (blah) => {
                // localStorage.setItem("origin",'0');
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
