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
  
  public register_email: string = '';
  public register_phone: string = '';
  public password1: string = '';
  public password2: string = '';
  public verify_code: string = '';
  public return_code: string = '1';
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }
  public role = '3';

  constructor(public httpService: HttpServiceService,
    public http: HttpClient,
    public router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController:LoadingController) { }

  ngOnInit() {
  }

  async onRegister(form: NgForm) {
    const loading = await this.loadingController.create({
      message: '请稍等...',
    });
    await loading.present();
    if (this.hasCode()) {
      if (form.valid) {
        //验证验证码是否正确
        // await this.onSendSMS();
        if (this.verify_code == this.return_code) {
          //两次密码输入是否一致
          if (this.password1 == this.password2) {
            var params = {
              email: this.register_email,
              password: this.password1
            }
            if (this.role == '3') {
              params["role_id"] = '3';
            }
            console.log(params);
            var api = '/register';//后台接口
            this.httpService.post(api, params).then(async (response: any) => {
              await loading.dismiss();
              if (response.data.respCode == 1) {//注册成功
                let alert = await this.alertController.create({
                  header: '提示',
                  message: '注册成功！',
                  buttons: [
                    {
                      text: '确认',
                      cssClass: 'secondary',
                      handler: (blah) => {
                        this.router.navigateByUrl('/lesson-tabs');
                        localStorage.setItem("email", this.register_email);
                        localStorage.setItem("isLogin", "1");
                        this.getInf(this.register_email);
                      }
                    }
                  ]
                });
                alert.present();

              } else if (response.data.respCode == '该邮箱已经注册过了！') {
                let alert = await this.alertController.create({
                  header: '提示',
                  message: '该邮箱已经注册过了！',
                  buttons: ['确定']
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
        } else {
          await loading.dismiss();
          let toast = await this.toastController.create({
            message: '验证码不正确！',
            duration: 2000
          });
          toast.present();
        }
      }
    }
  }
  onSendSMS() {
    //点击按钮后请求后台数据 开始倒计时
    if (this.verifyCode.disable == true) {
      var params = {//后台所需参数
        phone: this.register_phone,
      };
      //获取邮箱，将邮箱发给后台，请求后台返回验证码
      var api = '/edumam/msm/send/';//后台接口
      this.httpService.get(api, params).then((response: any) => {
        console.log(response.data)
        this.return_code = response.data.respCode;//返回参数
      })
      // var api = '/loginByCode';//后台接口
      // this.httpService.post(api, params).then(async (response: any) => {
      //   if (response.data.role == "-1") {
      //     var api = '/sendCode';//后台接口
      //     this.httpService.post(api, params).then((response: any) => {
      //       this.return_code = response.data.respCode;//返回参数
      //     })
      //     this.verifyCode.disable = false;
      //     this.settime();
      //   } else if (response.data.respCode == "账号已被删除！") {
      //     let alert = await this.alertController.create({
      //       header: '提示',
      //       message: '该账号已被删除！',
      //       buttons: ['确定']
      //     });
      //     alert.present();
      //   } else {
      //     let alert = await this.alertController.create({
      //       header: '提示',
      //       message: '您已注册过到云账号，请直接登录！',
      //       buttons: ['确定']
      //     });
      //     alert.present();
      //   }
      // })
    }

  }

  hasCode() {
    if (this.verify_code != null && this.return_code != null) {
      return true;
    } else {
      return false;
    }
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
    this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + "秒)";
    setTimeout(() => {
      this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + "秒)";
      this.settime();
    }, 1000);
  }

  //获取个人信息
  getInf(email) {
    var params = {//后台所需参数
      email: email,
    };
    var api = '/user/info';//后台接口
    this.httpService.get(api, params).then(async (response: any) => {
      if (response.status == 200) {
        console.log(response.data.role)
        localStorage.setItem("role", response.data.role);
      }
    })
  }


}

