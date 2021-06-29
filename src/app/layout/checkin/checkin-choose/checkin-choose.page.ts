import { CheckinComponent } from './../../../shared/components/checkin/checkin.component';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController, AlertController, ToastController, PickerController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-checkin-choose',
  templateUrl: './checkin-choose.page.html',
  styleUrls: ['./checkin-choose.page.scss'],
})
export class CheckinChoosePage implements OnInit {

  public params = {};
  public record = []
  public timeOptions = [[]]
  public checkinTime = -1// 发起的限时签到时间

  public checkinId = -1 // 签到id
  public checkinType = -1// 签到类型
  public startTime = ''//签到开始时间
  public endTime = ''// 签到结束时间
  public latitude: any;
  public longitude: any;
  constructor(public modalController: ModalController,
    public router: Router,
    public loadingController: LoadingController,
    public httpService: HttpServiceService,
    private geolocation: Geolocation,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    public toastController: ToastController,
    public pickerController: PickerController,) {
  }
  
  async checkExplain() {
    //弹出说明模态框
    const modal = await this.modalController.create({
      component: CheckinComponent,

    });
    await modal.present();
  }
  
  gotoCheckin(checkinFlage) {// checkinFlage 0代表一键签到，1代表限时签到
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

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getCheckHistory()
  }
  
  async getCheckHistory() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    var cid = localStorage.getItem("course_id")
    var api = '/sign/course/history/' + cid
    this.httpService.getAll(api).then(async (response: any) => {
      if (response.data.message == "权限不足，请联系管理员！") {
        // this.presentToast(response.data.message)
        this.router.navigateByUrl('home-tabs/mylesson');
      }
      else
      {
        this.record = response.data
      }
      await loading.dismiss();
    })
  }
  
  checkHistoryDetail(item) {
    this.router.navigate(['checkin-result'], {
      queryParams: { checkinId: item.signId}
    });
  }



}