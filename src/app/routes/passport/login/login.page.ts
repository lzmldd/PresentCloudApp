import { NgForm } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public tab = "tab2";
  public result: any;
  login = {
    phone: '',
    password: '',
    code:''
  }
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }
  constructor(public httpService: HttpServiceService,
    public http: HttpClient, 
    public router: Router,
    public alertController: AlertController,
    public toastController: ToastController,
    // private iab: InAppBrowser,
    // private qq: QQSDK,
    public loadingController: LoadingController) { }

  ngOnInit() {
  }

  // 获取验证码
  async onSendSMS() 
  {
    //点击获取验证码按钮后请求后台数据 开始验证码倒计时
    if (this.verifyCode.disable == true) {
      //获取手机号，将手机号发给后台，请求后台返回验证码
      var params = {//后台所需参数
        phone: this.login.phone,
      };
      var api = '/loginCaptcha';//后台接口
      this.httpService.get(api, params).then(async (response: any) => {
        
        if (response.data.message == "该手机号未注册，请先注册") {
          let alert = await this.alertController.create({
            header: '提示',
            message: '该手机号未注册，请先注册',
            mode: 'ios',
            buttons: [
              {
                text: '好的',
                role: 'cancel'
              },
              {
                text: '去注册',
                handler: () => {
                  this.router.navigateByUrl('/register');
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
  
  // 设置验证码倒计时
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

  async onLogin(form: NgForm) {
    if (form.valid) {
      var params;
      const loading = await this.loadingController.create({
        message: '登录中...',
      });
      await loading.present();
      if (this.tab == 'tab2') {//验证码登录
        // 点击登录后进行验证码验证
        params = {//后台所需参数
          usernameOrPhone: this.login.phone,
          code: this.login.code
        };
        var api = '/mobile/loginByCode';//后台接口
        
        this.httpService.post(api, params).then(async (response: any) => {
          await loading.dismiss();
          if (response.data.code == 200) {// 登陆成功
            localStorage.setItem("isLogin", "1");
            localStorage.setItem("token", response.data.obj.tokenHead + response.data.obj.token);// 保存拦截器的token
            this.getInfo();
            this.setLoginTime();
          } else if (response.data.message == "该手机号未注册，请先注册") {// 登陆失败，code=500
            let alert = await this.alertController.create({
              header: '提示',
              message: '该手机号未注册，请先注册',
              mode: 'ios',
              buttons: [
                {
                  text: '好的',
                  role: 'cancel'
                },
                {
                  text: '去注册',
                  handler: () => {
                    this.router.navigateByUrl('/register');
                  }
                }
              ]
            });
            alert.present();
          } else if (response.data.message == "请先获取验证码") {
            this.presentToast(response.data.message)
          } else if (response.data.message == "验证码不能为空") {
            this.presentToast('请输入验证码')
          }else if (response.data.message == "验证码输入错误") {
            this.presentToast('请输入正确的验证码')
          } 
        })
      } else {//密码登录
        params = {//后台所需参数
          usernameOrPhone: this.login.phone,
          password: this.login.password
        };
        //将账号密码传给后台，得到返回值，若匹配无误，则进入班课列表界面
        var api = '/mobile/loginByPassword';//后台接口
        await loading.dismiss();
        this.httpService.post(api, params).then(async (response: any) => {
          // console.log(response.data);
          await loading.dismiss();
          if (response.data.code == 200) {// 登录成功
            localStorage.setItem("isLogin", "1");
            localStorage.setItem("token", response.data.obj.tokenHead + response.data.obj.token);
            this.getInfo();
            this.setLoginTime();
          } else if (response.data.message == "账号被禁用，请联系管理员")// 登陆失败，code=500
          {
            this.presentToast(response.data.message)
          } else if (response.data.message == "手机端仅允许教师/学生登录")// 登陆失败，code=500
          {
            this.presentToast(response.data.message)
          } else if (response.data.message == "用户不存在"){
            let alert = await this.alertController.create({
              header: '提示',
              message: '手机号输入错误',
              mode: 'ios',
              buttons: [
                {
                  text: '忘记密码',
                  handler: () => {
                    this.router.navigateByUrl('/forget-password');
                  }
                },
                {
                  text: '好的',
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          }
          else if (response.data.message == "密码输入错误") {
            let alert = await this.alertController.create({
              header: '提示',
              message: '密码输入错误',
              mode: 'ios',
              buttons: [
                {
                  text: '忘记密码',
                  handler: () => {
                    this.router.navigateByUrl('/forget-password');
                  }
                },
                {
                  text: '好的',
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          }
        })
      }
    }
  }
  
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      mode: 'ios'
    });
    toast.present();
  }

  //获取个人信息
  getInfo() {
    var api = '/common/user/info';//后台接口
    // token中有存对应的user信息，因此不用传参数 
    this.httpService.getAll(api).then(async (response: any) => {
      console.log(response)
      if (response.status == 200) {
        localStorage.setItem("role_id", response.data.roleId);
        localStorage.setItem("user_id", response.data.id);
        localStorage.setItem("phone", response.data.phone);
        // console.log(localStorage.getItem("role_id") !='undefined')
        if (localStorage.getItem("role_id") != 'undefined') {// 本地存储取的undefined是字符串
          this.router.navigateByUrl('/home-tabs/mylesson');
        }
        else {
          console.log('未知错误')
        }
      }
    })
  }

  setLoginTime() {
    let myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    //获取当前日
    var date = myDate.getDate();
    var h = myDate.getHours() < 10 ? '0' + myDate.getHours() : '' + myDate.getHours(); //获取当前小时数(0-23)
    var m = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : '' + myDate.getMinutes(); //获取当前分钟数(0-59)
    var s = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : '' + myDate.getSeconds();
    localStorage.setItem("loginTime", year + "/" + month + "/" + date + " " + h + ":" + m + ":" + s);
  }
  


  
  }



