import { AlertController, ToastController } from '@ionic/angular';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-join',
  templateUrl: './confirm-join.page.html',
  styleUrls: ['./confirm-join.page.scss'],
})
export class ConfirmJoinPage implements OnInit {
  public lesson = {
    picture: "",
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
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    // this.lesson = JSON.parse(localStorage.getItem("joinInf"));
  }
  ionViewWillEnter() {
    this.lesson = JSON.parse(localStorage.getItem("joinInf"));
  }
  async confirmJoin() {
    var api = '/course/mobile/student?code=' + localStorage.getItem("joinCode");//后台接口
    this.httpService.postAll(api).then(async (response: any) => {

      if (response.status == 200) {
        if (response.data.message == "您已加入该班课") {
          this.presentToast('您已加入本班课，请勿重复加入！')
          this.router.navigate(['/home-tabs/mylesson'])
        } else if (response.data.message == "加入班课成功") {
          const alert = await this.alertController.create({
            message: '加入班课成功！',
            buttons: [
              {
                text: '确认',
                cssClass: 'secondary',
                handler: (blah) => {
                  this.router.navigate(['/home-tabs/mylesson'], {
                    queryParams: {
                      join: '1'
                    }
                  })
                }
              }
            ]
          });
          await alert.present();

        }
      }
    })

  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }
}