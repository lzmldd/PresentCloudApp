import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkin-result',
  templateUrl: './checkin-result.page.html',
  styleUrls: ['./checkin-result.page.scss'],
})
export class CheckinResultPage implements OnInit {
  
  public absenceList = [];
  public attendanceList = []
  public show = false;
  public checkText = "多选";
  public isSelectAllAbsence = false;
  public isSelectAllAttendance = false;
  public attendanceTotal = 0;
  public absenceTotal = 0;
  public checkinId =-1;
  
  constructor(public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    public router: Router,
    public loadingController: LoadingController,
    public httpService: HttpServiceService,
    public toastController: ToastController,
    public activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.checkinId = queryParams.checkinId
    })
  }
  
  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getData();
  }

  async getData() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    var api = '/sign/records/' + this.checkinId
    this.httpService.getAll(api).then(async (response: any) => {
      await loading.dismiss();
      var res = response.data.obj
      this.absenceList = res.unSignedList;
      this.absenceTotal = res.total - res.signedCount;
      // console.log(this.absenceList)
      this.attendanceList = res.signedList;
      this.attendanceTotal = res.signedCount;
    })
    this.show = false;
    this.checkText = "多选";
  }

  async presentToast(str) {
    const toast = await this.toastController.create({
      message: str,
      duration: 2000
    });
    toast.present();
  }
  showCheck() {

    if (this.show == false) {
      this.show = true;
      this.checkText = "取消多选";
    } else {
      this.show = false;
      this.checkText = "多选";
    }
  }
  selectAllAbsence() {
    this.isSelectAllAbsence = !this.isSelectAllAbsence;

    if (this.isSelectAllAbsence == true) {
      this.absenceList.forEach(item => {
        item.checked = true;
      });
      this.isSelectAllAbsence = false;
    } else {
      this.isSelectAllAbsence = true;
      this.absenceList.forEach(item => {
        item.checked = false;
      });
    }

  }
  checkAbsence(item) {
    let sum = 0;
    // console.log(item)
    this.absenceList.forEach(item1 => {
      if (item == item1) {
        if (item.checked == false || item.checked == undefined) {
          sum += 1;
        } else {
          this.isSelectAllAbsence = false;
        }
      } else {
        if (item1.checked == true) {
          sum += 1;
        } else {
          this.isSelectAllAbsence = false;
        }
      }
      // if (item1.checked == true && item1 != item) {
      //   sum += 1;
      // }
      // else if (item1.checked == false) {
      //   if (item1 == item && item.checked == false) {
      //     sum += 1;
      //   } else {
      //     this.isSelectAllAbsence = false;
      //   }
      // }
    });
    if (sum == this.absenceList.length) {
      this.isSelectAllAbsence = true;
    } else {
      this.isSelectAllAbsence = false;
    }

  }
  selectAllAttendance() {
    this.isSelectAllAttendance = !this.isSelectAllAttendance;

    if (this.isSelectAllAttendance == true) {
      this.attendanceList.forEach(item => {
        item.checked = true;
      });
      this.isSelectAllAttendance = false;
    } else {
      this.isSelectAllAttendance = true;
      this.attendanceList.forEach(item => {
        item.checked = false;
      });
    }

  }
  checkAttendance(item) {
    let sum = 0;
    this.attendanceList.forEach(item1 => {
      if (item == item1) {
        if (item.checked == false || item.checked == undefined) {
          sum += 1;
        } else {
          this.isSelectAllAttendance = false;
        }
      } else {
        if (item1.checked == true) {
          sum += 1;
        } else {
          this.isSelectAllAttendance = false;
        }
        // if (item1.checked == true && item1 != item) {
        //   sum += 1;
        // }
        // else if (item1.checked == false) {
        //   if (item1 == item && item.checked == false) {
        //     sum += 1;
        //   } else {
        //     this.isSelectAllAttendance = false;
        //   }
      }
    });
    if (sum == this.attendanceList.length) {
      this.isSelectAllAttendance = true;
    } else {
      this.isSelectAllAttendance = false;
    }

  }
  async presentActionSheet(item) {
    const actionSheet = await this.actionSheetController.create({
      // header: '设置',
      cssClass: 'my-custom-class',
      buttons: [{
        text: '设为缺勤',
        role: 'destructive',
        handler: () => {
          this.setState(item, 0)
        }
      }, {
        text: '设为请假',
        handler: () => {
          this.setState(item, 2)
        }
      }, {
        text: '设为迟到',
        handler: () => {
          this.setState(item, 3)
        }
      }, {
        text: '设为早退',
        handler: () => {
          this.setState(item, 4)
        }
      },
      {
        text: '设为已签到',
        handler: () => {
          this.setState(item, 1)
        }
      }, {
        text: '取消',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }
  
  setState(i, type) {
    var studentIds = [];
    if (this.show == true) {// 多选
      console.log('多选')
      this.absenceList.forEach(item => {
        if (item.checked == true) {
          studentIds.push(item.id)
        }
      });
      this.attendanceList.forEach(item => {
        if (item.checked == true) {
          studentIds.push(item.id)
        }
      });
    } else {
      console.log('单选')
      studentIds.push(i.id);
    }
    console.log(studentIds)
    var params = {
      signId: this.checkinId,
      status: type,
      studentIds: studentIds,  
    }
    var api = '/sign/status'
    this.httpService.put(api, params).then(async (response: any) => {
      if (response.data.code == 200) {
        this.presentToast("状态修改成功！");
        this.getData();
      } 
    })
  }
  setAllState() {
    var sum = 0;
    this.absenceList.forEach(item => {
      if (item.checked == true) {
        sum += 1;
      }
    });
    this.attendanceList.forEach(item => {
      if (item.checked == true) {
        sum += 1;
      }
    });
    if (this.isSelectAllAttendance == true || this.isSelectAllAbsence == true || sum > 0) {
      this.presentActionSheet([]);
    } else {
      this.presentToast("请至少选中一条数据");
    }
  }
  goback() {
    this.router.navigate(['/checkin-choose'], {
      queryParams: {
        flush: '1'
      }
    })
  }
  
}
