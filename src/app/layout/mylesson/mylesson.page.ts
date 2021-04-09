import { SearchComponent } from './../../shared/components/search/search.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpServiceService } from './../../shared/services/http-service.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, LoadingController } from '@ionic/angular';

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
    courseCode: "",//班课号
    className: "",//班级名
    term: "",// 学期
    teacherName: "",// 老师名
    name: "" // 课程名名
  }
  ];
  constructor(public httpService: HttpServiceService,
    public http: HttpClient,
    public modalController: ModalController,
    public router: Router,
    public actionSheetController: ActionSheetController,
    public loadingController: LoadingController,
    private activatedRoute: ActivatedRoute) {
    //请求后台获取 我创建的班课列表
    this.activatedRoute.queryParams.subscribe(async queryParams => {
      if (localStorage.getItem("role") == '2') {//教师
        this.flag = '0';
        this.getCreateLesson();//教师
      } else {
        this.getMyLesson();//学生
      }

      this.list = [];//教师班课列表
      this.list1 = [];//学生班课列表
      this.index = 0;
      if (queryParams.flush == '1') {
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
    if (localStorage.getItem("role") == '2') {//教师
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
    var api ='/dcloud/course/mobile/teacher'
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
        buttons: ['确认']
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

    var api = '/dcloud/course/mobile/student'
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
        buttons: ['确认']
      });
      await alert.present();
    })
  }

  // get() {
  //   console.log("tab" + this.tab);
  // }
  getCurrentLesson(index) {
    // 获取点击的班课名和班课号
    localStorage.setItem("lesson_name", this.lessonList[index].name);
    localStorage.setItem("lesson_courseCode", this.lessonList[index].courseCode);
    if (this.tab == 'tab1') {
      localStorage.setItem("isTeacher", '1');
    } else {
      localStorage.setItem("isTeacher", '0');
    }
    // this.router.navigateByUrl("/tabs/member],")
  }

  gotoCheckin(index) {
    // 发起签到，点击跳转到签到页面
    localStorage.setItem("lesson_name", this.lessonList[index].name);
    localStorage.setItem("lesson_courseCode", this.lessonList[index].courseCode);
    this.router.navigateByUrl('/choose');
  }

  async addLesson() {
    if (localStorage.getItem("role") == '2') {// 教师
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
          // {
          //   text: '创建班课',
          //   handler: () => {
          //     this.router.navigateByUrl('createlesson');
          //   }
          // },
          {
            text: '使用班课号加入班课',
            handler: () => {
              this.router.navigateByUrl('join-by-code');
            }
          },
          {
            text: '使用二维码加入班课',
            handler: () => {
              this.router.navigateByUrl('qr-scanner');
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



