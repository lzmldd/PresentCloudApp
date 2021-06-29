import { HttpServiceService } from './../../../../shared/services/http-service.service';
import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my',
  templateUrl: './my.page.html',
  styleUrls: ['./my.page.scss'],
})
export class MyPage implements OnInit {

  public user = {
    userFace: "",// 头像
    phone: localStorage.getItem("phone"),
    roleId: localStorage.getItem("role_id"),
    exp: 0// 经验值
  };
  public isTeacher;

  constructor(
    public router: Router,
    public httpService: HttpServiceService,
  ) {
    this.getInf();
  }

  ngOnInit() {
    this.getInf();
  }
  ionViewDidEnter() {
    this.getInf();
  }
  //获取个人信息
  getInf() {

    var api = '/common/user/info';//后台接口
    // token中有存对应的user信息，因此不用传参数 
    this.httpService.getAll(api).then(async (response: any) => {
      // console.log(response.data)
      if (response.status == 200) {
        this.user = response.data
        console.log(this.user)
        if (this.user.roleId == "2") {
          this.isTeacher = "(教师)";
        } else {
          this.isTeacher = "(学生)";
        }
        // this.user.exp = response.data.exp;
        // this.user.userFace = response.data.userFace;
        localStorage.setItem("role_id", response.data.roleId);
        localStorage.setItem("user_id", response.data.id);
        localStorage.setItem("phone", response.data.phone);
      }
    })
  }

  onLogout() {
    localStorage.setItem("isLogin", "0");
    localStorage.removeItem("token");
    this.router.navigateByUrl('login');
    // var api = '/logout';//后台接口
    // // token中有存对应的user信息，因此不用传参数 
    // this.httpService.postAll(api).then(async (response: any) => {
    //   // console.log(response.data)

    // })
  }
  
}
