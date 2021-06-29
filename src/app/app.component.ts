import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  sideMenuDisabled = true;
  backButtonPressed: boolean = false; //用于判断是否退出
  customBackActionSubscription: Subscription;
  url: any = '/lesson-tabs';//初始界面的url
  private keyValue: any = false;//判断是否返回上一界面
  public interval: any;

  constructor(
    public toast: ToastController,
    public navController: NavController,//导航控制器
    public router: Router,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public alertController: AlertController,) {}
  
  /**
   * 重写物理返回键
   */
  @HostListener('document:ionBackButton', ['$event'])
  private overrideHardwareBackAction($event: any) {
    $event.detail.register(100, async () => {
      //关闭键盘
      try {
        if (this.keyValue) {
          this.keyValue = false;
          return;
        }
      } catch (error) {
        console.log(error);
      }

      //关闭action sheet
      try {
        const element = await this.actionSheetCtrl.getTop();
        if (element) { element.dismiss(); return; }
      } catch (error) {
        console.log(error);
      }

      //关闭modal
      try {
        const element = await this.modalCtrl.getTop();
        if (element) { element.dismiss(); return; }
      } catch (error) {
        console.log(error);
      }

      if (this.router.url === '/'
        || this.router.url === '/home-tabs'
        || this.router.url === '/home-tabs/mylesson'
        || this.router.url === '/home-tabs/mylesson?flush=1'
        || this.router.url === '/home-tabs/mylesson?delete=1'
        || this.router.url === '/home-tabs/mylesson?join=1'
        || this.router.url === '/home-tabs/mylesson?create=1'
        || this.router.url === '/home-tabs/my'
      ) {//判断是否是初始界面
        if (this.backButtonPressed) {
          navigator['app'].exitApp();
          this.backButtonPressed = false;//退出
        } else {
          const toast = await this.toast.create({
            message: '再按一次退出应用',
            duration: 2000,
            mode:'ios'
          });
          toast.present();
          this.backButtonPressed = true;
          setTimeout(() => this.backButtonPressed = false, 2000);//延时器改变退出判断属性
        }
      } else if (this.router.url.split('?')[0] === '/checkin' && localStorage.getItem('isTeacher')=='1') {
        //确认是否要结束签到
        const alert = await this.alertController.create({
          header: '提示',
          message: '请先放弃或结束签到！',
          buttons: ['确认']
        });
        await alert.present();
      } else if (this.router.url.split('?')[0] === '/checkin-result') {
        this.router.navigate(['checkin-choose']);
      }

      else if (this.router.url === '/create-success') {
        // localStorage.setItem("create-back", '1');
        // if (localStorage.getItem("create-back") == '1') {
        //   this.router.navigateByUrl('lesson-tabs/mylesson', { replaceUrl: true });
        // }
        // this.router.navigate(['/lesson-tabs/mylesson'], { queryParams: { success: '1' } });
      } else if (this.router.url.split('?')[0] === '/lesson-tabs/member'
        || this.router.url.split('?')[0] === '/lesson-tabs/detail'
        || this.router.url.split('?')[0] === '/checkin-choose'
        || this.router.url.split('?')[0] === '/create-lesson'
        || this.router.url.split('?')[0] === '/user-info') {
        this.router.navigate(['home-tabs/mylesson']);
      } else {
        this.navController.back();//返回上一界面
      }
    })
  }

}
