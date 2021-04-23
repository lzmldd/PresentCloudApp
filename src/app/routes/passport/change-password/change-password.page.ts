import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  public changeinf = {
    oldpassword: '',
    password1: '',
    password2: ''
  }
  
  constructor(private toastController: ToastController,
    public httpService: HttpServiceService,
    public alertController: AlertController,
    public http: HttpClient,
    public router: Router) { }

  ngOnInit() {
  }
  async onChangePass(form: NgForm) {
    if (form.valid) {
    //两次新密码是否相同
    if (this.changeinf.password1 == this.changeinf.password2) {
      //请求后台发送三个参数
      var params = {//后台所需参数
        id: localStorage.getItem("user_id"),
        oldPassword: this.changeinf.oldpassword,//旧密码
        newPassword: this.changeinf.password2,
      };
      console.log(params)
      //将账号密码传给后台，得到返回值，若匹配无误，则进入班课列表界面
      var api = '/common/user/pwd';//后台接口
      this.httpService.post(api, params).then(async (response: any) => {
        // console.log(response.data);
        if (response.data.code == 200) {
          //修改密码成功，跳转到登录页
          let alert = await this.alertController.create({
            header: '提示',
            message: '设置新密码成功，点击确定返回登录页！',
            buttons: [{
              text: '确定',
              cssClass: 'secondary',
              handler: (blah) => {
                //修改密码成功，跳转到登录页
                this.router.navigateByUrl('login');
              }
            }
            ]
          });
          alert.present();
        }
      })

    } else {
      let toast = await this.toastController.create({
        message: '两次新密码输入不一致！',
        duration: 2000
      });
      toast.present();
    }
  }
  }

}

