import { SearchComponent } from './../../../shared/components/search/search.component';
import { HttpServiceService } from './../../../shared/services/http-service.service';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, LoadingController, PickerController, AlertController, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-mylesson',
  templateUrl: './mylesson.page.html',
  styleUrls: ['./mylesson.page.scss'],
})
export class MylessonPage implements OnInit {

  public tab = "tab1";
  public listThreshold = 7;
  public list = [];
  public list1 = [];
  public index = 0;
  public endflag = '0';
  public flag = '0';
  public lessonList = [{
    picture: "",
    name: "", // 课程名
    teacherName: "",// 老师名
    className: "",//班级名
    term: "",// 学期
    courseCode: "",//班课号
    id: "",//班课id
  }
  ];
  public timeOptions = [[]]
  public checkinTime = -1// 发起的限时签到时间

  public checkinId = -1 // 签到id
  public checkinType = -1// 签到类型
  public startTime = ''//签到开始时间
  public endTime = ''// 签到结束时间
  public latitude: any;
  public longitude: any;

  constructor(public httpService: HttpServiceService,
    public http: HttpClient,
    public modalController: ModalController,
    public router: Router,
    public actionSheetController: ActionSheetController,
    public loadingController: LoadingController,
    public activatedRoute: ActivatedRoute,
    public pickerController: PickerController,
    public toastController: ToastController,
    public alertController: AlertController,
    public geolocation: Geolocation,) {
    //请求后台获取 我创建的班课列表
    this.activatedRoute.queryParams.subscribe(async queryParams => {
      if (localStorage.getItem("role_id") == '2') {//教师
        this.flag = '0';
        this.getCreateLesson();//教师
      } else {
        this.getMyLesson();//学生
      }

      this.list = [];//教师班课列表
      this.list1 = [];//学生班课列表
      this.index = 0;
      if (queryParams.create == '1') {
        this.flag = '0';
        this.getCreateLesson();
      } else if (queryParams.delete == '1') {
        this.flag = '0';
        this.getCreateLesson();
      } else if (queryParams.join == '1') {
        this.getMyLesson();
      }
    });

  }

  ngOnInit() {
    if (localStorage.getItem("role_id") == '2') {//教师
      this.flag = '0';
      this.getCreateLesson();
    } else {
      this.getMyLesson();
    }
  }

  ionViewWillEnter() {
    if (localStorage.getItem("role_id") == '2') {//教师
      this.flag = '0';
      this.getCreateLesson();
    } else {
      this.getMyLesson();
    }

  }

  doRefresh(event) {
    if (this.tab == 'tab1') {
      this.forTeacher();
    } else {
      this.forStudent();
    }
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async search(type) {
    //弹出搜索模态框
    const modal = await this.modalController.create({
      component: SearchComponent,
      componentProps: {
        type: type
      }
    });
    await modal.present();
  }

  // ionViewWillEnter() {
  //   this.getCreateLesson();
  // }

  //我创建的 user的教师id-->该教师对应的课程（登录时就应存该id）
  getCreateLesson() {
    this.tab = 'tab1';
    this.endflag = '0';
    this.forTeacher();
  }

  async forTeacher() {
    localStorage.setItem("isTeacher", '1');

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    var api = '/course/mobile/teacher'
    this.httpService.getAll(api).then(async (response: any) => {
      await loading.dismiss();
      this.lessonList = response.data.data;
      // console.log(response.data)
      if (this.lessonList.length != 0) {
        this.flag = '1';
      }
      if (this.lessonList.length > this.listThreshold) {
        for (var i = 0; i < this.listThreshold; i++) {
          this.list[i] = this.lessonList[i];
        }
        this.index = this.listThreshold;
      } else {
        this.list = this.lessonList;
        this.endflag = '1';
      }
    }).catch(async function (error) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: '警告',
        message: '请求失败！',
        buttons: ['确认'],
        mode: 'ios'
      });
      await alert.present();
    })
  }

  //我加入的 user的学生id，该学生对应的课程
  getMyLesson() {
    this.tab = 'tab2';
    this.flag = '0';
    this.endflag = '0';
    this.forStudent();
  }

  async forStudent() {
    localStorage.setItem("isTeacher", '0');

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    var api = '/course/mobile/student'
    this.httpService.getAll(api).then(async (response: any) => {
      await loading.dismiss();
      this.lessonList = response.data.data;
      // console.log(response)
      if (this.lessonList.length != 0) {
        this.flag = '1';
      }
      if (this.lessonList.length > this.listThreshold) {
        for (var i = 0; i < this.listThreshold; i++) {
          this.list1[i] = this.lessonList[i];
        }
        this.index = this.listThreshold;
      } else {
        this.list1 = this.lessonList;
        this.endflag = '1';
      }
    }).catch(async function (error) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: '警告',
        message: '请求失败！',
        buttons: ['确认'],
        mode: 'ios'
      });
      await alert.present();
    })
  }

  getCurrentLesson(index) {
    // 获取点击的班课号和班课id
    localStorage.setItem("select_courseName", this.lessonList[index].name);
    localStorage.setItem("select_courseCode", this.lessonList[index].courseCode);
    localStorage.setItem("course_id", this.lessonList[index].id);
    if (this.tab == 'tab1') {
      localStorage.setItem("isTeacher", '1');
    } else {
      localStorage.setItem("isTeacher", '0');
    }
  }

  async checkin(index) {
    localStorage.setItem("select_courseName", this.lessonList[index].name);
    localStorage.setItem("select_courseCode", this.lessonList[index].courseCode);
    localStorage.setItem("course_id", this.lessonList[index].id);
    if (localStorage.getItem("role_id") == '2') {// 教师发起签到
      const actionSheet = await this.actionSheetController.create({
        mode: "ios",
        buttons: [
          {
            text: '限时签到',
            handler: () => {
              this.openPicker(1, 59, this.timeOptions)
            }
          },
          {
            text: '一键签到',
            handler: () => {
              this.gotoCheckin(0)// 0代表一键签到

            }
          },
          {
            text: '取消',
            role: 'destructive'
          }
        ]
      });
      await actionSheet.present();
    } else {// 学生参与签到，进入签到页面
      var cid = parseInt(localStorage.getItem("course_id"))
      var api = '/sign/haveSign/' + cid
      this.httpService.getAll(api).then(async (response: any) => {
        if (response.data.message == "可以签到") {//学生可以签到，进入签到页面
          this.checkinId = response.data.obj.id// 签到id
          this.checkinType = response.data.obj.type;// 0代表一键签到，1代表限时签到
          this.startTime = response.data.obj.startTime;
          this.endTime = response.data.obj.endTime;
          this.router.navigate(['checkin'], {
            queryParams: {
              flag: 0, checkinId: this.checkinId, checkinType: this.checkinType,
              startTime: this.startTime, endTime: this.endTime
            }
          });
        } else {
          const toast = await this.toastController.create({
            message: '老师还没开始签到或签到已结束', // 弹出输入不能为空的文本框
            duration: 2000,
            mode: 'ios'
          });
          toast.present();
        }
      })
    }

  }

  gotoCheckin(checkinFlage) {
    // 发起签到，点击跳转到签到页面
    var cid = localStorage.getItem("course_id")
    var api = '/sign/haveSign/' + cid
    this.httpService.getAll(api).then(async (response: any) => {

      if (response.data.message == "可以签到") {//签到未结束，教师进入签到中的界面 

        this.checkinId = response.data.obj.id// 签到id
        this.checkinType = response.data.obj.type;// 0代表一键签到，1代表限时签到
        this.startTime = response.data.obj.startTime;
        this.endTime = response.data.obj.endTime;
        if (this.checkinType == 0)
          this.presentToast('有未结束的一键签到，进入签到页面...')
        else if (this.checkinType == 1)
          this.presentToast('有未结束的限时签到，进入签到页面...')
        this.router.navigate(['checkin'], {
          queryParams: {
            flag: 1, checkinId: this.checkinId, checkinType: this.checkinType,
            startTime: this.startTime, endTime: this.endTime
          }
        });
      }
      else {// 签到已结束,教师可以直接发起签到，创建一个签到
        await this.getLocation();// 获取位置信息
        const loading = await this.loadingController.create({
          message: '发起签到中...',
        });
        await loading.present();//加载
        var local = this.latitude + "," + this.longitude
        var cid = localStorage.getItem("course_id")
        if (checkinFlage == 0)
          var api = '/sign/create/nolimit?id=' + cid + '&local=' + local;
        else
          var api = '/sign/create/oneminute?id=' + cid + '&timeout=' + this.checkinTime + '&local=' + local;
        this.httpService.postAll(api).then(async (response: any) => {
          await loading.dismiss();
          if (response.data.message == "创建签到成功") {//创建签到成功
            this.checkinId = response.data.obj.id// 签到id
            this.checkinType = response.data.obj.type;// 0代表一键签到，1代表限时签到
            this.startTime = response.data.obj.startTime;
            this.endTime = response.data.obj.endTime;
            this.router.navigate(['checkin'], {
              queryParams: {
                flag: 1, checkinId: this.checkinId, checkinType: this.checkinType,
                startTime: this.startTime, endTime: this.endTime
              }
            });
          } 
          else if (response.data.message == "班级内暂无学生") {
            this.presentToast('先邀请你的学生加入班课再签到吧')
          
          }
        });

      }
    })

  }

  async getLocation() {
    const loading = await this.loadingController.create({
      message: '获取位置信息中...',
    });
    await loading.present();
    this.geolocation.getCurrentPosition().then(async (resp) => {
      this.latitude = JSON.stringify(resp.coords.latitude);
      this.longitude = JSON.stringify(resp.coords.longitude);
      await loading.dismiss();
      console.log(this.latitude, this.longitude)
      //获得系统参数
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      mode: 'ios'
    });
    toast.present();
  }

  pushTime(length) {
    for (var i = 1; i < length; i++) {
      this.timeOptions[0].push(i + '分钟')
    }
    console.log(this.timeOptions)
  }

  async openPicker(numColumns = 1, numOptions = 5, multiColumnOptions) {
    this.pushTime(60)
    const picker = await this.pickerController.create({
      mode: 'ios',
      columns: this.getColumns(numColumns, numOptions, multiColumnOptions),
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '签到时长',
          cssClass: 'color:secondary'
        },
        {
          text: '立即开始',
          handler: (value) => {
            if (value.col.text.length == 3) {
              this.checkinTime = value.col.text[0]
            }
            else {
              this.checkinTime = value.col.text[0] + value.col.text[1]
            }
            console.log(this.checkinTime);
            this.gotoCheckin(1)// 1代表限时签到

          }
        }
      ]
    });
    await picker.present();
  }

  getColumns(numColumns, numOptions, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }
    return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      })
    }
    return options;
  }
  async addLesson() {
    if (localStorage.getItem("role_id") == '2') {// 教师
      const actionSheet = await this.actionSheetController.create({
        mode: "ios",
        buttons: [
          {
            text: '创建班课',
            handler: () => {
              this.router.navigateByUrl('create-lesson');
            }
          },
          {
            text: '取消',
            role: 'destructive'
          }
        ]
      });
      await actionSheet.present();
    } else {
      const actionSheet = await this.actionSheetController.create({
        mode: "ios",
        buttons: [
          {
            text: '加入班课',
            handler: () => {
              this.router.navigateByUrl('join-by-code');
            }
          },
          {
            text: '取消',
            role: 'destructive'
          }
        ]
      });
      await actionSheet.present();
    }

  }

  loadData(event) {
    if (localStorage.getItem("isTeacher") == "1") {
      // console.log(this.list.length);
      // console.log(this.lessonList.length);
      setTimeout(() => {
        if (this.list.length == this.lessonList.length) {
          event.target.disabled = true;
          this.index = this.lessonList.length;
        }
        event.target.complete();
        var disparity = this.lessonList.length - this.list.length;
        if (disparity > this.listThreshold) {
          for (var i = this.index; i < this.index + this.listThreshold; i++) {
            this.list.push(this.lessonList[i]);
          }
          this.index = this.index + this.listThreshold;
        } else {
          for (var i = this.index; i < this.lessonList.length; i++) {//最后一次加载
            this.endflag = '1';
            this.list.push(this.lessonList[i]);
          }
        }
      }, 500);
    } else {
      setTimeout(() => {
        if (this.list1.length == this.lessonList.length) {
          event.target.disabled = true;
          this.index = this.lessonList.length;
        }
        event.target.complete();
        var disparity = this.list1.length - this.lessonList.length;
        if (disparity > this.listThreshold) {
          for (var i = this.index; i < this.index + this.listThreshold; i++) {
            this.list1.push(this.lessonList[i]);
          }
          this.index = this.index + this.listThreshold;
        } else {
          for (var i = this.index; i < this.lessonList.length; i++) {
            this.endflag = '1';
            this.list1.push(this.lessonList[i]);
          }
        }
      }, 500);
    }

  }


}



