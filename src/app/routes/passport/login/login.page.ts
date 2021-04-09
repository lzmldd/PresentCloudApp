import { NgForm } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
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
    password: ''
  }
  
  public verify_code:string = '';
  public return_code:string = '1';
  randomnum = null;
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }
  constructor(public httpService: HttpServiceService,
    public http: HttpClient, 
    public router: Router,
    public alertController: AlertController,
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
      var api = '/dcloud/loginCaptcha';//后台接口
      this.httpService.get(api, params).then(async (response: any) => {
        console.log(response.data);
        // this.result = response.data;
        if (response.data.message == "该手机号未注册，请先注册") {
          let alert = await this.alertController.create({
            header: '提示',
            message: '该手机号未注册，请先注册',
            buttons: ['确定']
          });
          alert.present();
        } else {
          this.return_code = response.data.message.substring(9);
          console.log(this.return_code)
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
    this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + "秒)";
    setTimeout(() => {
      this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + "秒)";
      this.settime();
    }, 1000);
  }

  // 验证码验证
  async onVerify(form: NgForm) {
    if (form.valid) {
      //点击确认，与后台返回的验证码进行对比
      console.log("输入的验证码为" + this.verify_code);
      console.log("返回的验证码为" + this.return_code);
      console.log(this.verify_code == this.return_code)
      if (this.verify_code == this.return_code) {//相同
        localStorage.setItem("isLogin", "1");
        localStorage.setItem("phone", this.login.phone);
        this.getInf();
        this.setTime();
      } else {//不同，弹出提示框
        let alert = await this.alertController.create({
          header: '提示',
          message: '请输入正确的验证码!',
          buttons: ['确定']
        });
        alert.present();
      }

    }
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
        // this.onVerify(form);
        params = {//后台所需参数
          usernameOrPhone: this.login.phone,
          code:this.verify_code
        };
        var api = '/dcloud/mobile/loginByCode';//后台接口
        
        this.httpService.post(api, params).then(async (response: any) => {
          // console.log(response.data);
          await loading.dismiss();
          if (response.data.message == "该手机号未注册，请先注册") {
            let alert = await this.alertController.create({
              header: '提示',
              message: '该手机号未注册，请先注册',
              buttons: ['确定']
            });
            alert.present();
          } else if (response.data.message =="验证码不能为空") {
            let alert = await this.alertController.create({
              header: '提示',
              message: '请输入验证码',
              buttons: ['确定']
            });
            alert.present();
          } 
          else {
            localStorage.setItem("isLogin", "1");
            localStorage.setItem("token", response.data.obj.tokenHead + response.data.obj.token);// 保存拦截器的token
            localStorage.setItem("phone", this.login.phone);
            this.getInf();
            this.setTime();
          }
        })
      } else {//密码登录
        params = {//后台所需参数
          usernameOrPhone: this.login.phone,
          password: this.login.password
        };
        //将账号密码传给后台，得到返回值，若匹配无误，则进入班课列表界面
        var api = '/dcloud/mobile/loginByPassword';//后台接口

        this.httpService.post(api, params).then(async (response: any) => {
          // console.log(response.data);
          await loading.dismiss();
          if (response.data.code == 200) {
            //获取该user的信息（teacher_id,student_id）
            localStorage.setItem("isLogin", "1");
            localStorage.setItem("token", response.data.obj.tokenHead + response.data.obj.token);
            localStorage.setItem("phone", this.login.phone);
            this.getInf();
            this.setTime();
          } else {
            let alert = await this.alertController.create({
              header: '提示',
              message: '用户名或者密码不正确',
              buttons: ['确定']
            });
            alert.present();
          }
        })
      }
    }
  }

  //获取个人信息
  getInf() {
    var api = '/dcloud/user/info';//后台接口
    // token中有存对应的user信息，因此不用传参数 
    this.httpService.getAll(api).then(async (response: any) => {
      // console.log(response.data)
      if (response.status == 200) {
        localStorage.setItem("role", response.data.roleId);
        localStorage.setItem("user_id", response.data.id);
        // console.log(localStorage.getItem("role") =='undefined')
        if (localStorage.getItem("role") != 'undefined') {
          this.router.navigateByUrl('/lesson-tabs/mylesson');
        }
        else {
          console.log('未知错误')
        }
      }
    })
  }

  setTime() {
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
  isOverTime() {
    let endDate = new Date();
    let startDate = localStorage.getItem("loginTime");
    //时间差的毫秒数 
    let date3 = endDate.getTime() - new Date(startDate).getTime();
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    // //计算出小时数
    // var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
    // var hours=Math.floor(leave1/(3600*1000))
    // //计算相差分钟数
    // var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
    // var minutes=Math.floor(leave2/(60*1000))
    // //计算相差秒数
    // var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    // var seconds=Math.round(leave3/1000)
    // alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")

    if (days > 30) {
      return false;
    } else {
      return true;
    }

  }
  


  // loginByQQ() {
  //   var api = "/getQQCode";

  //   this.httpService.getAll(api).then(async (response: any) => {
  //     console.log(response.data.url);
  //     const browser = this.iab.create(response.data.url);
  //   })
  //   // const options: QQShareOptions = {
  //   //   client: this.qq.ClientType.QQ,
  //   //   scene: this.qq.Scene.QQ,
  //   //   title: 'This is a title for cordova-plugin-qqsdk',
  //   //   url: 'https://cordova.apache.org/',
  //   //   image: 'https://cordova.apache.org/static/img/cordova_bot.png',
  //   //   description: 'This is  Cordova QQ share description',
  //   //   flashUrl:  'http://stream20.qqmusic.qq.com/30577158.mp3',
  //   // }

  //   // const clientOptions: QQShareOptions = {
  //   //   client: this.qq.ClientType.QQ,
  //   // }

  //   // const shareTextOptions: QQShareOptions = {
  //   //   client: this.qq.ClientType.QQ,
  //   //   text: 'This is Share Text',
  //   //   scene: this.qq.Scene.QQ,
  //   // }

  //   // this.qq.ssoLogin(clientOptions)
  //   //    .then(result => {
  //   //       // Success
  //   //       console.log('token is ' + result.access_token);
  //   //       console.log('userid is ' + result.userid);
  //   //       console.log('expires_time is ' + new Date(parseInt(result.expires_time)) + ' TimeStamp is ' + result.expires_time);
  //   //    })
  //   //    .catch(error => {
  //   //      console.log(clientOptions);
  //   //       console.log(error); // Failed
  //   //    });

  }



