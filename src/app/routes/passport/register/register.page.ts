import { HttpClient } from '@angular/common/http';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  register={
    username:'',
    phone:'',
    code:'',
    password1:'',
    password2: '',
    roleId: '3'// 默认3代表学生，2代表老师
  }

  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }
  

  constructor(public httpService: HttpServiceService,
    public http: HttpClient,
    public router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController:LoadingController) { }

  ngOnInit() {
  }

  onSendSMS() {
    //点击按钮后请求后台数据 开始倒计时
    if (this.verifyCode.disable == true) {
      var params = {//后台所需参数
        phone: this.register.phone,
      };
      var api = '/registerCaptcha';//后台接口
      this.httpService.get(api, params).then(async (response: any) => {
        console.log(response.data)
        if (response.data.message == "该手机号已注册，请去登录") {
          // const toast = await this.toastCtrl.create({
          //   message: '该手机号未注册，请先注册', // 弹出输入不能为空的文本框
          //   duration: 2000
          // });
          // toast.present();

          let alert = await this.alertController.create({
            header: '提示',
            message: '该手机号已注册，请去登录',
            buttons: [
              {
                text: '好的',
                role: 'cancel'
              },
              {
                text: '去登录',
                handler: () => {
                  this.router.navigateByUrl('/login');
                }
              }
            ]
          });
          alert.present();
        } else {
          this.verifyCode.disable = false;
          this.settime();
        }
      })
    }
  }

  async onRegister(form: NgForm) {
    const loading = await this.loadingController.create({
      message: '请稍等...',
    });
    await loading.present();
      if (form.valid) {
          //两次密码输入是否一致
        if (this.register.password1 == this.register.password2) {
            var params = {
              username: this.register.username,
              phone: this.register.phone,
              code: this.register.code,
              password: this.register.password1,
              checkPassword: this.register.password2,
              roleId: parseInt(this.register.roleId)

            }
            console.log(params);
          // var api = '/register';//后台接口
          var api = '/mobile/quickRegister'
            this.httpService.post(api, params).then(async (response: any) => {
              await loading.dismiss();
              if (response.data.message=="请先获取验证码")
              {
                this.presentToast(response.data.message)
              } else if (response.data.message == "验证码输入错误") {
                this.presentToast('请输入正确的验证码')
              } else if (response.data.respCode == "该用户名已被注册") {
                let alert = await this.alertController.create({
                  header: '提示',
                  message: '该用户名已注册，请去登录',
                  buttons: [
                    {
                      text: '好的',
                      role: 'cancel'
                    },
                    {
                      text: '去登录',
                      handler: () => {
                        this.router.navigateByUrl('/login');
                      }
                    }
                  ]
                });
                alert.present();
              } else if (response.data.message == "注册成功") {//注册成功
                let alert = await this.alertController.create({
                  header: '提示',
                  message: '注册成功！',
                  buttons: [
                    {
                      text: '确认',
                      cssClass: 'secondary',
                      handler: (blah) => {
                        this.router.navigateByUrl('/home-tabs/mylesson');
                        localStorage.setItem("phone", this.register.phone);
                        localStorage.setItem("isLogin", "1");
                        this.getInf();
                      }
                    }
                  ]
                });
                alert.present();

              } 
            })

          } else {
            await loading.dismiss();
            let toast = await this.toastController.create({
              message: '两次密码不一致！',
              duration: 2000
            });
            toast.present();
          }
      }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
 

  settime() {
    if (this.verifyCode.countdown == 1) {
      this.verifyCode.countdown = 60;
      this.verifyCode.verifyCodeTips = "获取验证码";
      this.verifyCode.disable = true;
      return;
    } else {
      this.verifyCode.countdown--;
    }
    this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + "s)";
    setTimeout(() => {
      this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + "s)";
      this.settime();
    }, 1000);
  }

  //获取个人信息
  getInf() {
    
    var api = '/common/user/info';//后台接口
    this.httpService.getAll(api).then(async (response: any) => {
      if (response.status == 200) {
        console.log(response.data.role)
        localStorage.setItem("role_id", response.data.role);
      }
    })
  }


}

