import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
