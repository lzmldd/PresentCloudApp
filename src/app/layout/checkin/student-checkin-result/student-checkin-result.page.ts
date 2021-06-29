import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-student-checkin-result',
  templateUrl: './student-checkin-result.page.html',
  styleUrls: ['./student-checkin-result.page.scss'],
})
export class StudentCheckinResultPage implements OnInit {

  public historyFlag = '0';
  public sid = "";
  public checkHistory = [];
  public percent = null;

  public checkinId = -1 // 签到id
  public checkinType = -1// 签到类型
  public startTime = ''//签到开始时间
  public endTime = ''// 签到结束时间

  constructor(public modalController: ModalController,
    public httpService: HttpServiceService,
    // public http: HttpClient,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public toastController: ToastController,
    private geolocation: Geolocation,
    private activatedRoute: ActivatedRoute,
    public router: Router) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      console.log(queryParams);
      if (queryParams.historyFlag == '0') {
        this.historyFlag = '0';// historyFlag=0代表当前用户的签到记录
        this.sid = localStorage.getItem("user_id");//当前用户id
      }else{
        this.historyFlag = '1';// historyFlag=1代表选择的学生的签到记录
        this.sid = queryParams.sid;
      }
      this.getHistory()
    
    });
  }

  async getHistory() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    var api = '/sign/course';//后台接口
    var params = {
      cid: localStorage.getItem("course_id"),
      sid: this.sid
    }
    this.httpService.get(api, params).then(async (response: any) => {
      
      this.checkHistory = response.data;
      await loading.dismiss();
      // this.percent = this.checkHistory[this.checkHistory.length - 1].per
      // this.checkHistory.splice(this.checkHistory.length - 1)
    })
  }
  
  ngOnInit() {
    
  }
  ionViewWillEnter() {
    
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      mode: 'ios'
    });
    toast.present();
  }

  gotoCheckin()
  {
    {// 学生参与签到，进入签到页面
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

  doRefresh(event) {
    this.getHistory();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

}
