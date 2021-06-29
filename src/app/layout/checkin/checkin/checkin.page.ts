import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage implements OnInit {

  public flag = -1;// 0代表学生签到，1代表教师发起签到
  public checkinId = -1;// 签到id
  public checkinType = -1;// 签到类型，0代表一键签到，1代表限时签到
  public title = ''
  public startTime = ''//签到开始时间
  public endTime = ''// 签到结束时间
  public countDown = -1// 剩余的签到时间(秒数)
  public showCounDown = ''// 剩余的签到时间(秒数)
  public latitude: any;
  public longitude: any;
  public signedCount;// 已签到人数
  public total;// 总人数
  public interval: any = null;
  public interval1: any = null;
  public interval2: any = null;
  verifyCode: any = {
    verifyCodeTips: "刷新(15s)",
    countdown: 15,
  }
  
  constructor(public httpService: HttpServiceService,
    public loadingController: LoadingController,
    public router: Router,
    public activatedRouter: ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController,
    public geolocation: Geolocation,) {
    this.activatedRouter.queryParams.subscribe(queryParams => {
      this.flag = queryParams.flag;
      this.checkinId = queryParams.checkinId;
      this.checkinType = queryParams.checkinType;
      if (this.checkinType == 1) {
        this.startTime = queryParams.startTime;
        this.endTime = queryParams.endTime;
      }
      console.log(this.flag, this.checkinId, this.checkinType);
      if (this.flag == 0 && this.checkinType == 0)
        this.title = '一键签到';
      else if (this.flag == 0 && this.checkinType == 1)
        this.title = '限时签到';
      else if (this.flag == 1 && this.checkinType == 0)
        this.title = '一键签到中';
      else if (this.flag == 1 && this.checkinType == 1)
        this.title = '限时签到中';
    });
    // this.startCheck()
  }

  ngOnInit() {
    // if (this.flag == 1)// 1代表教师发起签到
    // {
    //   this.getCheckResult();// 先获取签到的人数，显示
    //   this.startRequest();// 循环获取已签到人数和人数

    // }
    // if(this.checkinType==1)
    // {
    //   this.getCountDown()
    // }

  }
  ionViewWillEnter() {
    //这两个方法在将要进入界面的时候会触发,相当于是局部刷新,整个页面不会跟着刷新
    if (this.flag == 1)// 1代表教师发起签到
    {
      this.getCheckResult();// 先获取签到的人数，显示
      this.startRequest();// 循环获取已签到人数和人数

    }
    if (this.checkinType == 1) {
      this.getCountDown()
    }
  }
  ionViewWillLeave() {
    this.stopRequest()
  }

  // 学生进行签到
  async checkin() {
    await this.getLocation()
    const loading = await this.loadingController.create({
      message: '签到中...',
    });
    await loading.present();//加载
    var local = this.latitude + "," + this.longitude
    if(this.checkinType==0)// 0代表一键签到，1代表限时签到
    {
      var api = '/sign/nolimit?id=' + this.checkinId + '&local=' + local;
    }
    else
    {
      var api = '/sign/time?id=' + this.checkinId + '&local=' + local;
    }
    this.httpService.getAll(api).then(async (response: any) => {
      await loading.dismiss();
      if (response.data.message == "签到成功") {
        this.presentToast(response.data.message)
        this.router.navigateByUrl('home-tabs/mylesson');
      } else if (response.data.message == "已签到成功") {
        this.presentToast(response.data.message+",请勿重复签到")
        this.router.navigateByUrl('home-tabs/mylesson');
      } else {
        this.presentToast(response.data.message)
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
      // this.checkin()
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      mode:'ios'
    });
    toast.present();
  }

  // 教师放弃签到
  async giveupCheckin() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '放弃签到!',
      message: '确定要放弃签到吗？',
      mode: 'ios',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: '确定',
          handler: () => {
            var api = '/sign/close'
            var params = {
              id: this.checkinId,
              type: 0
            }
            this.stopRequest();
            this.httpService.get(api, params).then(async (response: any) => {

              this.router.navigateByUrl('checkin-choose', { replaceUrl: true });
            })

          }
        }
      ]
    });
    await alert.present();
  }
  async endCheckin() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '结束签到!',
      message: '确定要结束签到吗？',
      mode: 'ios',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: '确定',
          handler: () => {
            var api = '/sign/close'
            var params = {
              id: this.checkinId,
              type: 1
            }
            this.stopRequest()
            this.httpService.get(api, params).then(async (response: any) => {
              this.router.navigate(['checkin-result'], { queryParams: { checkinId: this.checkinId } });

            })

          }
        }
      ]
    });
    await alert.present();
  }

  startRequest() {//启动计时器函数
    if (this.interval != null) {//判断计时器是否为空
      clearInterval(this.interval);
      this.interval = null;
    }
    if(this.checkinType==0)
    {
      this.interval = setInterval(() => {
        this.getCheckResult();
      }, 10000);
    }else{
      this.interval = setInterval(() => {
        this.getCheckResult();
      }, 10000);
    }
    
  }
  async getCheckResult() {
    const loading = await this.loadingController.create({
          message: 'Please wait...',
        });
    await loading.present();
    var api = '/sign/count/' + this.checkinId
    this.httpService.getAll(api).then(async (response: any) => {
      await loading.dismiss();
      if (response.data.message == "权限不足，请联系管理员！") {
        this.stopRequest()
        // this.presentToast(response.data.message)
        this.router.navigateByUrl('home-tabs/mylesson');
      }
      else {
        this.signedCount = response.data.obj.signedCount;
        this.total = response.data.obj.total;
        if (this.signedCount == this.total)
        {
          var api = '/sign/close'
          var params = {
            id: this.checkinId,
            type: 1
          }
          this.stopRequest()
          this.presentToast("满勤，签到完成")
          this.httpService.get(api, params).then(async (response: any) => {
            this.router.navigate(['checkin-result'], { queryParams: { checkinId: this.checkinId } });
       
          })

        }
      }

    })
  }
  
  stopRequest() {
    clearInterval(this.interval);
    this.interval = null;
    clearTimeout(this.interval1)
    this.interval1 = null;
    clearTimeout(this.interval2)
    this.interval2 = null;
  }
  async getCountDown() {
    var api = '/sign/time/' + this.checkinId
    await this.httpService.getAll(api).then(async (response: any) => {
      this.countDown=response.data
    })
    this.calculateShowTime(this.countDown)
    this.setCountDown()
  }

  async setCountDown() {
    if (this.countDown==0)
    {
      this.stopRequest()
      let alert = await this.alertController.create({
        header: '提示',
        message: '限时签到已结束',
        mode: 'ios',
        buttons: [
          {
            text: '确定',
            handler: () => {
              if (this.flag == 1)// 1代表教师发起签到
              {
                this.router.navigate(['checkin-result'], { queryParams: { checkinId: this.checkinId } });
              }
              else// 学生进行签到
              {
                this.router.navigateByUrl('/home-tabs/mylesson');
              }
            }
          }
        ]
      });
      alert.present();
      return;
    }
    else
      this.countDown--;
    this.interval1 =setTimeout(() => {
      this.calculateShowTime(this.countDown)
      this.setCountDown();
    }, 1000);
  }

  calculateShowTime(countDown)
  { 
    let clock = parseInt((countDown / 3600).toString()).toString();
    let minute = parseInt((countDown / 60).toString()).toString();
    let second = (countDown - Number(minute) * 60).toString();
    if (clock.length == 1)
      clock = '0' + clock
    if (minute.length == 1)
      minute = '0' + minute
    if (second.length == 1)
      second = '0' + second
    this.showCounDown = clock + ':' + minute + ':' + second
    console.log(this.showCounDown)
  }

  refresh()
  {
    this.getCheckResult()
    this.startRequest()
  }

  // // 设置验证码倒计时
  // async setRefreshTime(isautorefresh) {
  //   if (isautorefresh==0)
  //   {
  //     clearTimeout(this.interval2)
  //     this.interval2 = null;
  //     this.verifyCode.countdown = 15;
  //     this.verifyCode.verifyCodeTips = "刷新(" + this.verifyCode.countdown + "s)";
  //     const loading = await this.loadingController.create({
  //       message: 'Please wait...',
  //     });
  //     await loading.present();
  //     await loading.dismiss();
  //     this.setRefreshTime(1)
  //     this.getCheckResult()
  //     this.startRequest()
  //     return;
  //   }else if (this.verifyCode.countdown == 0 && isautorefresh==1) {
  //     this.verifyCode.countdown = 15;
  //     this.verifyCode.verifyCodeTips = "刷新(" + this.verifyCode.countdown + "s)";
  //     const loading = await this.loadingController.create({
  //       message: 'Please wait...',
  //     });
  //     await loading.present();
  //     await loading.dismiss();
  //     this.setRefreshTime(1)
  //     this.getCheckResult()
  //     this.startRequest()
  //     return;
  //   } else {
  //     this.verifyCode.countdown--;
  //   }
  //   this.verifyCode.verifyCodeTips = "刷新(" + this.verifyCode.countdown + "s)";
  //   if(isautorefresh==1)
  //   {
  //     this.interval2 = setTimeout(() => {
  //       // this.verifyCode.verifyCodeTips = "刷新(" + this.verifyCode.countdown + "s)";
  //       this.setRefreshTime(1);
  //     }, 1000);
  //   }
  // }


}