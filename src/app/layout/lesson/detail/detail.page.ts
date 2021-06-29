import { PickerController, AlertController, ToastController } from '@ionic/angular';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public lesson = {
    picture:'',
    className: '计算机专硕1班',
    name: '工程训练',
    creater: null,
    teacherName: '池老师',
    term: '2019-2020-1',
    flag: 1,
    courseCode: '88888888',
    allowIn: true,
    schoolName: '',
    departmentName:'',
    schoolId: null,// 课程的学校id
    departmentId: null,// 课程的学院id
    learnRequire: '未设置',
    teachProgress: '未设置',
    examSchedule: '未设置',
    enabled:true
  };
  public checked = 1;
  public schoolLesson="";
  public selectedName = "请选择"
  public isTeacher: any;

  constructor(
    public router: Router,
    public httpService: HttpServiceService,
    public activatedRoute: ActivatedRoute,
    public pickerController: PickerController,
    public alertController: AlertController,
    public toastController: ToastController,
  ) {
  }

  ngOnInit() {
    console.log(this.router.url.split('?')[0])
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.pageNum == '1') {
        this.lesson.learnRequire = queryParams.property;
      } else if (queryParams.pageNum == '2') {
        this.lesson.teachProgress = queryParams.property;
      } else if (queryParams.pageNum == '3') {
        this.lesson.examSchedule = queryParams.property;
      } else if (queryParams.pageNum == '6') {
        this.selectedName = queryParams.name
        this.lesson.schoolName = queryParams.name.split(' ')[0]
        this.lesson.departmentName = queryParams.name.split(' ')[1]
        console.log(queryParams)
        console.log(this.lesson)
        // 更新学校院系名
        var params={
          id: localStorage.getItem("course_id"),
          schoolId: queryParams.id.split('/')[0],
          departmentId: queryParams.id.split('/')[1]
        }
        // console.log(params)
        var api ='/course/manage/'
        this.httpService.put(api, params).then(async (response: any) => {
          // console.log(response.data);
        })
      } else {
        if (JSON.stringify(queryParams) != "{}") {
          this.lesson.className = queryParams.className;
          this.lesson.name = queryParams.name;
          this.lesson.term = queryParams.term;
          this.lesson.flag = queryParams.flag;
          // console.log(this.lesson.flag)
          if (this.lesson.flag == 1) {
            this.schoolLesson = "学校课表班课";
          } else {
            this.schoolLesson = null;
          }
        }

      }
    });
    // this.isTeacher = localStorage.getItem("isTeacher");
    // this.getLesson();
  }

  ionViewWillEnter() {
    this.isTeacher = localStorage.getItem("isTeacher");
    this.selectedName = this.lesson.schoolName + ' ' + this.lesson.departmentName;
    this.getLesson();
  }

  // ionViewDidLeave(){
  //   this.statusBar.backgroundColorByHexString('#ffffff'); //状态栏的样式设置
  // }
  
  updateAllowIn() {
    // 更新是否允许加入
    // console.log(this.lesson.allowIn)
    var params = {
      id: localStorage.getItem("course_id"),
      allowIn: !this.lesson.allowIn
    }
    // console.log(params)
    var api = '/course/manage/';
    this.httpService.put(api, params).then(async (response: any) => {
      // console.log(response.data.obj.allowIn);
      if (response.data.obj.allowIn)
      {
        this.presentToast('学生可以加入班课')
      }
      else
      {
        this.presentToast('学生不能加入班课')
      }
    })
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      mode: 'ios'
    });
    toast.present();
  }
  
  async getLesson() {
    if (this.isTeacher == '1') {
    var api = '/course/manage/' + localStorage.getItem("course_id");
    await this.httpService.getAll(api).then(async (response: any) => {
        this.lesson = response.data.obj;
        // console.log(this.lesson);
      })
    }
    else{
      var params = {
        code: localStorage.getItem("select_courseCode")
      }
      var api = '/course/';//后台接口
      await this.httpService.get(api, params).then(async (response: any) => {
        this.lesson = response.data.obj;
        console.log(this.lesson);
      })
    }
    if (this.lesson.teacherName == null) {//获取老师名
      this.lesson.teacherName = this.lesson.creater.name
    }
    if (this.lesson.schoolName == null || this.lesson.schoolName == "") {
      this.selectedName = "请选择";
    } else {
      //获取学校院系名
      this.selectedName = this.lesson.schoolName + ' ' + this.lesson.departmentName;
    }
    if (this.lesson.learnRequire == null) {
      if (this.isTeacher == '1') {
        this.lesson.learnRequire = "未设置";
      } else {
        this.lesson.learnRequire = "暂无内容";
      }
    }
    if (this.lesson.teachProgress == null) {
      if (this.isTeacher == '1') {
        this.lesson.teachProgress = "未设置";
      } else {
        this.lesson.teachProgress = "暂无内容";
      }
    }
    if (this.lesson.examSchedule == null) {
      if (this.isTeacher == '1') {
        this.lesson.examSchedule = "未设置";
      } else {
        this.lesson.examSchedule = "暂无内容";
      }
    }
    if (this.lesson.flag == 1) {
      this.schoolLesson = "学校课表班课";
    } else {
      this.schoolLesson = null;
    }
  }

  async deleteLesson() {
    const alert = await this.alertController.create({
      header: '提示',
      message: '是否确认删除？',
      mode: 'ios',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'medium'
        }, {
          text: '确认',
          handler: () => {
            var api = '/course/manage/' + localStorage.getItem("course_id");
            this.httpService.deleteAll(api).then(async (response: any) => {
              if (response.data.message=="删除班课成功") {
                this.presentToast('删除班课成功')
                this.router.navigate(['/home-tabs/mylesson'], { queryParams: { delete: '1' } });
              }
            })

          }
        }
      ]
    });
    await alert.present();

  }

  async endLesson() {
    const alert = await this.alertController.create({
      header: '提示',
      message: '是否确认结束？',
      mode: 'ios',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'medium'
        }, {
          text: '确认',
          handler: () => {

            var params = {
              id: localStorage.getItem("course_id"),
              enabled: false
            }
            // console.log(params)
            var api = '/course/manage/';
            this.httpService.put(api, params).then(async (response: any) => {
              if (response.data.message == "修改班课成功") {
                this.presentToast('结束班课成功')
                this.lesson.enabled=false
               
              }
              
            })
            

          }
        }
      ]
    });
    await alert.present();

  }
  
  async outLesson() {
    const alert = await this.alertController.create({
      header: '提示',
      message: '是否确认退出？',
      mode: 'ios',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'medium'
        }, {
          text: '确认',
          handler: async () => {
            var api = '/course/mobile/student/' + localStorage.getItem("course_id");
            this.httpService.deleteAll(api).then(async (response: any) => {
              if (response.data.message == "退出班课成功") {
                this.presentToast('退出班课成功')
                this.router.navigate(['/home-tabs/mylesson'], { queryParams: { join: '1' } });
              }
            })

          }
        }
      ]
    });
    await alert.present();

  }
}
