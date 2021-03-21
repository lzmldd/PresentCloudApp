import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public tab = "tab2";
  public result: string;
  login = {
    email: '',
    password: ''
  }
  public email: any = '';
  public verify_code:string = '';
  public return_code:string = '1';
  randomnum = null;
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }
  constructor() { }

  ngOnInit() {
  }

}
