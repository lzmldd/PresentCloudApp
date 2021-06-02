import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-join-by-code',
  templateUrl: './join-by-code.page.html',
  styleUrls: ['./join-by-code.page.scss'],
})
export class JoinByCodePage implements OnInit {

  public code = null;
  public lesson = {
    picture:"",
    className: "",
    name: "",
    teacherName: "",
    schoolLesson: ""
  }
  constructor(
    public router: Router,
    public httpService: HttpServiceService,
    public alertController: AlertController,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  joinLesson() {
    // console.log(this.code==null)
    if (this.code == null)
    {
      this.presentToast('请输入班课号')
    }
    else
    {
      var params = {
        code: this.code
      }
      var api = '/course/';//后台接口
      this.httpService.get(api, params).then(async (response: any) => {
        if (response.data.code == 200) {
          //获得班课信息
          this.lesson.className = response.data.obj.className
          this.lesson.name = response.data.obj.name
          this.lesson.teacherName = response.data.obj.creater.name
          this.lesson.picture = response.data.obj.picture
          if (response.data.obj.flag==1)
            this.lesson.schoolLesson = "学校课表班课"
          else
            this.lesson.schoolLesson = "其他班课"
          console.log(this.lesson)
          localStorage.setItem("joinCode", this.code);
          localStorage.setItem("joinInf", JSON.stringify(this.lesson));
          this.router.navigateByUrl("/confirm-join");
        }
        else if (response.data.message == "没有此班课") {
          this.presentToast('无效的班课号')
        }
        else if (response.data.message == "该班课不允许加入，请联系教师") {
          this.presentToast('该班课不允许加入，请联系教师')
        }
      })
    }
    
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }
}
