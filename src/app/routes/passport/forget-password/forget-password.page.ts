import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

  public emailVerify: string = '';
  public verify_code: string = '';
  public return_code: string = '1';
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }

  public forgetinf = {
    email: '',
    password1: '',//输入的新密码
    password2: '' //确认的新密码
  }
  
  constructor() { }

  ngOnInit() {
  }

}
