import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member',
  templateUrl: './member.page.html',
  styleUrls: ['./member.page.scss'],
})
export class MemberPage implements OnInit {
  public lesson = {
    courseCode: '',
    name: ''
  };
  
  public isTeacher: any;
  public isNo = '1';
  public member = [];
  public memberNumber: any = 0;
  public rank: any;
  public my_exp: any;
  public flag: any = '0';
  constructor(public modalController: ModalController,
    public router: Router,
    public httpService: HttpServiceService,
    // public http: HttpClient,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.isFlash == '1') {
        this.getdata();
      }
    })
  }

  ngOnInit() {
    // this.getdata();
  }
  ionViewWillEnter() {
    this.getdata();
  }

  async getdata() {
    this.lesson.name = localStorage.getItem("select_courseName");
    this.lesson.courseCode = localStorage.getItem("select_courseCode");
    this.isTeacher = localStorage.getItem("isTeacher");
    this.orderByExp();
  }

  async orderByNo() {
    this.isNo = '0';
    localStorage.setItem("isNo", "1");
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    //按学号排序List
    var params = {
      id: localStorage.getItem("course_id"),
      sortBy: "number"//按学号顺序显示
    }
    var api = '/course/mobile/member';//后台接口
    this.httpService.get(api, params).then(async (response: any) => {
      await loading.dismiss();
      if (response.data.length == 0) {
        this.flag = '0';
      } else {
        this.flag = '1';
        this.member = response.data;
        this.memberNumber = this.member.length;
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
  async orderByExp() {
    this.isNo = '1';
    localStorage.setItem("isNo", "0");
    //按经验值排序list
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();//加载

    var params = {
      id: localStorage.getItem("course_id"),
      sortBy: "exp"//按经验值顺序显示
    }
    var api = '/course/mobile/member';//后台接口
    this.httpService.get(api, params).then(async (response: any) => {

      await loading.dismiss();
      if (response.data.length == 0) {
        this.flag = '0';
      } else {
        this.flag = '1';
        this.member = response.data;
        this.memberNumber = this.member.length;
        //个人排名与经验值
        for (var i = 0; i < this.member.length; i++) {
          if (this.member[i].uid == localStorage.getItem("user_id"))
          {
            console.log(this.member[i])
            this.rank = this.member[i].rank;
            this.my_exp = this.member[i].exp;
            break;
          }
          
        }
        
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

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }

  // async searchMember() {
  //   //弹出搜索模态框
  //   const modal = await this.modalController.create({
  //     component: SearchMemberComponent,
  //     componentProps: {
  //       type: '按照姓名、学号检索'
  //     }
  //   });
  //   await modal.present();
  // }

  gotoCheck() {
    this.router.navigate(['/student-checkin-result'], {
      queryParams: {
        historyFlag: '0'
      }
    });
  }

}
