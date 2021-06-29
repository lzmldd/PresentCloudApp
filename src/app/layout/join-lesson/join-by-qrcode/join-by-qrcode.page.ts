import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Router } from '@angular/router';
import { NavController, Platform, AlertController, ToastController } from '@ionic/angular';
import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-join-by-qrcode',
  templateUrl: './join-by-qrcode.page.html',
  styleUrls: ['./join-by-qrcode.page.scss'],
})
export class JoinByQrcodePage implements OnInit {

  public lesson = {
    picture: "",
    className: "",
    name: "",
    teacherName: "",
    schoolLesson: ""
  }

  lightIcon: string;
  light: boolean;
  frontCamera: boolean;
  scannerClass: boolean;
  constructor(
    public platform: Platform,
    public scanner: QRScanner,
    public element: ElementRef,
    public navcontroller: NavController,
    public router: Router,
    public httpService: HttpServiceService,
    // public http: HttpClient,
    public alertController: AlertController,
    public toastController: ToastController,
  ) {
    this.lightIcon = 'flash-off';
    // this.modal.showLoading();
  }
  ngOnInit() {
    
  }
  ionViewDidEnter() {
    // this.modal.hideLoading();
    this.scannerClass = true;
    this.startScanner();
    this.scanner.show();
  }

  ngOnDestroy() {
    this.scannerClass = false;
    this.destroyScanner();
  }

  closeModal() {
    this.navcontroller.back();
    this.destroyScanner();
  }

  //是否开启闪光灯
  toogleLight() {
    this.light = !this.light;

    if (this.light) {
      this.lightIcon = 'flash';
      this.scanner.enableLight();
    } else {
      this.lightIcon = 'flash-off';
      this.scanner.disableLight();
    }
  }

  //前置摄像头or后置摄像头
  toggleCamera() {
    this.frontCamera = !this.frontCamera;
    if (this.frontCamera) {
      this.scanner.useFrontCamera();
    } else {
      this.scanner.useBackCamera();
    }
  }

  startScanner() {
    this.platform.ready().then(() => {
      this.scanner.destroy();
      // Optionally request the permission early
      this.scanner.prepare().then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          let scanSub = this.scanner.scan().subscribe((text: string) => {
            //获取扫描内容，请求后台加入班课
            
            localStorage.setItem("joinCode", text);
            this.confirmJoin()

            // var params = {
            //   code: text
            // }
            // var api = '/course/';//后台接口
            // this.httpService.get(api, params).then(async (response: any) => {
            //   if (response.data.code == 200) {
            //     //获得班课信息
            //     this.lesson.className = response.data.obj.className
            //     this.lesson.name = response.data.obj.name
            //     this.lesson.teacherName = response.data.obj.creater.name
            //     this.lesson.picture = response.data.obj.picture
            //     if (response.data.obj.flag == 1)
            //       this.lesson.schoolLesson = "学校课表班课"
            //     else
            //       this.lesson.schoolLesson = "其他班课"
            //     console.log(this.lesson)
            //     localStorage.setItem("joinCode", text);
            //     localStorage.setItem("joinInf", JSON.stringify(this.lesson));
            //     this.router.navigateByUrl("/confirm-join");
            //   }
            //   else if (response.data.message == "没有此班课") {
            //     this.presentToast('班课不存在')
            //   }
            //   else if (response.data.message == "该班课不允许加入，请联系教师") {
            //     this.presentToast('该班课不允许加入，请联系教师')
            //   }
            // })
          
            this.scanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            this.navcontroller.back();
          });

        } else if (status.denied) {
          this.scanner.openSettings();
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      }).catch((e: any) => (e));
    });
  }

  async confirmJoin() {
    var api = '/course/mobile/student?code=' + localStorage.getItem("joinCode");//后台接口
    this.httpService.postAll(api).then(async (response: any) => {
      this.presentToast(response.data.message)
      if (response.data.message == "该班课不允许加入，请联系教师") {
        this.presentToast('该班课不允许加入，请联系教师')
      }
      if (response.status == 200) {
        if (response.data.message == "该班课不存在") {    // 该班课不存在
          this.presentToast('班课不存在')
        }
        else if (response.data.message == "该班课不允许加入，请联系教师") {
          this.presentToast('该班课不允许加入，请联系教师')
        }
        else if (response.data.message == "您已加入该班课") {
          this.presentToast('您已加入本班课，请勿重复加入！')
          this.router.navigate(['/home-tabs/mylesson'])
        } else if (response.data.message == "该班课已结束") {
          this.presentToast('该班课已结束')
          // this.router.navigate(['/home-tabs/mylesson'])
        }
        else if (response.data.message == "加入班课成功") {
          const alert = await this.alertController.create({
            message: '加入班课成功！',
            mode: 'ios',
            buttons: [
              {
                text: '确认',
                cssClass: 'secondary',
                handler: (blah) => {
                  this.router.navigate(['/home-tabs/mylesson'], {
                    queryParams: {
                      join: '1'
                    }
                  })
                }
              }
            ]
          });
          await alert.present();

        }
      }
    })

  }
  destroyScanner() {
    this.scanner.destroy();
    // 这里延迟一秒将html背景色重新设置为白色，否则会变透明，影响视觉效果
    setTimeout(() => {
      (window.document.querySelector('html') as HTMLElement).style.backgroundColor = '#fff';
    }, 1000);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      mode: 'ios'
    });
    toast.present();
  }
}


