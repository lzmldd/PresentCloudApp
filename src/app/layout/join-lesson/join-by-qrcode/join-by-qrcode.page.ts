import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Router } from '@angular/router';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-join-by-qrcode',
  templateUrl: './join-by-qrcode.page.html',
  styleUrls: ['./join-by-qrcode.page.scss'],
})
export class JoinByQrcodePage implements OnInit {

  lightIcon: string;
  light: boolean;
  frontCamera: boolean;
  scannerClass: boolean;
  constructor(
    private platform: Platform,
    private scanner: QRScanner,
    private router: NavController,
    private element: ElementRef,
    private route: Router,
    public httpService: HttpServiceService,
    // public http: HttpClient,
    private alertController: AlertController
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
    this.router.back();
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
            var params = {
              code: text
            }
            var api = '/course/mobile/student';//后台接口
            this.httpService.post(api, params).then(async (response: any) => {
              if (response.status == 200) {
                if (response.data.respCode == "班课号不存在！") {
                  const alert = await this.alertController.create({
                    header: '警告',
                    message: '班课号不存在！',
                    buttons: ['确认']
                  });
                  await alert.present();
                } else {
                  //获得班课信息
                  localStorage.setItem("joinCode", text);
                  localStorage.setItem("joinInf", JSON.stringify(response.data));
                  this.route.navigateByUrl("/confirm-join");
                }
              }
            })
            this.scanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            this.router.back();
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

  destroyScanner() {
    this.scanner.destroy();
    // 这里延迟一秒将html背景色重新设置为白色，否则会变透明，影响视觉效果
    setTimeout(() => {
      (window.document.querySelector('html') as HTMLElement).style.backgroundColor = '#fff';
    }, 1000);
  }
}


