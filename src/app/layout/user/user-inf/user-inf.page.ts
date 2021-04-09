import { AlertController, PickerController, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-inf',
  templateUrl: './user-inf.page.html',
  styleUrls: ['./user-inf.page.scss'],
})
export class UserInfPage implements OnInit {

  public user = {
    phone: localStorage.getItem("phone"),
    image: "1",
    role: 3,
    sno: "",
    school: "0",
    sex: "0",
    telphone: "0",
    nickname: "0",
    name: "0",
    birth: "0",
    exp: "0"
  };
  selectedSchool: any;
  selectedAcademy: string;

  constructor(public router: Router,
    public httpService: HttpServiceService,
    public http: HttpClient,
    private alertController: AlertController,
    public pickerController: PickerController,
    public toast: ToastController,
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,) {

  }

  // pickerController = document.querySelector('ion-picker-controller');
  school = [[]]
  academy = [[]]
  schoolList = {}
  academyList = {}
  public flag = 0;
  public schoolChoosed = "未设置"
  public academyChoosed = "未设置"
  public academyId;
  public schoolOptions = 0;
  public academyOptions = 0;
  public isTeacher;
  ngOnInit() {
    // this.getInf()
    this.activatedRoute.queryParams.subscribe(async queryParams => {
      this.getInf()
    });
  }
  //获取个人信息
  async getInf() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    var api = '/dcloud/user/info';//后台接口
    this.httpService.getAll(api).then(async (response: any) => {
      if (response.status == 200) {
        // console.log(response.data);
        this.user = response.data;
        this.user["sex"] = response.data.sex.toString();
        this.user["phone"] = localStorage.getItem("phone");
        if (response.data.roleId == 2) {
          this.isTeacher = "(教师)";
        } else {
          this.isTeacher = "(学生)";
        }
        //获取学校名称
        if (response.data.name == 0) {
          this.user.name = "";
        }
        if (response.data.nickname == 0) {
          this.user.nickname = "";
        }
        if (response.data.sno == 0) {
          this.user.sno = "";
        }
        if (response.data.telphone == 0) {
          this.user.telphone = "";
        }

        if (this.user.school == null || this.user.school == "") {
          this.schoolChoosed = "未设置";
        } else {
          var str = this.user.school.split("/");
          var api = '/schools/getCode';//后台接口
          this.httpService.get(api, { code: str[0] }).then(async (response: any) => {
            this.schoolChoosed = response.data;
            if (this.schoolChoosed != "未设置") {
              //获取学院列表
              this.academy[0].length = 0;
              var param1 = {
                schoolCode: str[0],//父级id
              }
              // this.academyChoosed = '未设置';

              var api = '/schools';//后台接口
              this.httpService.get(api, param1).then(async (response: any) => {
                for (var i = 0; i < response.data.length; i++) {
                  this.academy[0].push(response.data[i].name);
                }
                this.academyList = response.data;
                this.academyOptions = this.academy[0].length;
              })
            }
          })
          if (JSON.stringify(str[1]) != "") {
            await loading.dismiss();
            this.httpService.get(api, { code: str[1] }).then(async (response: any) => {
              this.academyChoosed = response.data;
            })

          }


        }
      }
    })

    //获取学校列表
    this.school[0].length = 0;
    var param = {
      school: 1,
    }
    var api = '/schools';//后台接口
    this.httpService.get(api, param).then(async (response: any) => {

      this.schoolList = response.data;
      for (var i = 0; i < response.data.length; i++) {
        this.school[0].push(response.data[i].name);
      }
      this.schoolOptions = this.school[0].length;
    })
  }
  //编辑个人信息
  updateInf() {
    // if (form.valid) {
    var params = {
      phone: this.user.phone,
      image: "0",
      sno: this.user.sno,
      school: this.user.school,
      sex: this.user.sex,
      nickname: this.user.nickname,
      telphone: this.user.telphone,
      name: this.user.name,
      birth: this.user.birth,
    }
    console.log(params);
    var api = '/user/info';//后台接口
    this.httpService.put(api, params).then(async (response: any) => {
      console.log(response);
      if (response.data.respCode == 1) {
        let alert = await this.alertController.create({
          header: '提示',
          message: '修改成功！',
          buttons: ['确认']
        });
        alert.present();
        //修改成功，重新获取刷新页面
        var param = {//后台所需参数
          email: localStorage.getItem("email"),
        };
        var api = '/user/info';//后台接口
        this.httpService.get(api, param).then(async (response: any) => {
          if (response.status == 200) {
            this.user = response.data;
            this.user.sex = response.data.sex.toString();
            this.user["email"] = localStorage.getItem("email");
            if (response.data.name == 0) {
              this.user.name = "";
            }
            if (response.data.nickname == 0) {
              this.user.nickname = "";
            }
            if (response.data.sno == 0) {
              this.user.sno = "";
            }
            if (response.data.telphone == 0) {
              this.user.telphone = "";
            }
          }
        })
      } else if (response.data.respCode == "改手机号已被使用") {
        const toast = await this.toast.create({
          message: '改手机号已被使用',
          duration: 2000
        });
        toast.present();

      } else if (response.data.respCode == "改昵称已被使用") {
        const toast = await this.toast.create({
          message: '改昵称已被使用',
          duration: 2000
        });
        toast.present();
      }
    })
    // }
  }
  onLogout() {
    localStorage.setItem("isLogin", "0");
    this.router.navigateByUrl('');
  }
  async openPicker(numColumns = 1, numOptions, multiColumnOptions, isSchool) {
    if (isSchool != 1 && this.user.school.length == 0) {
      const alert = await this.alertController.create({
        header: '警告',
        message: '请先选择学校！',
        buttons: ['确认']
      });
      await alert.present();
    } else {
      const picker = await this.pickerController.create({
        columns: this.getColumns(numColumns, numOptions, multiColumnOptions, isSchool),
        buttons: [
          {
            text: '取消',
            role: 'cancel'
          },
          {
            text: '确认',
            handler: (value) => {
              var selected = this.getColumns(numColumns, numOptions, multiColumnOptions, isSchool);
              if (isSchool == 1) {
                this.flag = 1;
                this.academyId = selected[0].options[value.col.value].id;
                this.schoolChoosed = value.col.text;
                this.user.school = "";
                this.selectedSchool = selected[0].options[value.col.value].code;
                this.user.school += this.selectedSchool;
                //获取学院列表
                this.academy[0].length = 0;
                var param = {
                  academy: this.academyId,
                }
                // console.log(param);
                this.academyChoosed = '未设置';
                var api = '/schools';//后台接口
                this.httpService.get(api, param).then(async (response: any) => {
                  for (var i = 0; i < response.data.length; i++) {
                    this.academy[0].push(response.data[i].name);
                  }
                  this.academyList = response.data;
                  this.academyOptions = this.academy[0].length;
                })
              } else {
                this.flag++;//2
                if (this.flag > 2) {
                  this.flag--;
                  this.user.school = this.selectedSchool;
                }
                if (this.user.school.length == 0) {
                  console.log("请先选择学校");
                } else if (this.user.school.indexOf("/") == -1) {
                  this.academyChoosed = value.col.text;
                  this.selectedAcademy = selected[0].options[value.col.value].code;
                  this.user.school += "/" + this.selectedAcademy;
                } else {
                  // console.log(selected[0].options[value.col.value].code);
                  //更新后面的学院
                  var index = this.user.school.indexOf("/");
                  this.user.school = this.user.school.substr(0, index);
                  this.academyChoosed = value.col.text;
                  this.selectedAcademy = selected[0].options[value.col.value].code;
                  this.user.school += "/" + this.selectedAcademy;

                }
              }
              // console.log(this.user.school);
            }
          }
        ]
      });
      await picker.present();
    }
  }

  getColumns(numColumns, numOptions, columnOptions, isSchool) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col`,
        options: this.getColumnOptions(i, numOptions, columnOptions, isSchool)
      });
    }
    return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions, isSchool) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      if (isSchool == 1) {
        for (let j = 0; j < this.schoolOptions; j++) {
          if (this.schoolList[j].name == columnOptions[columnIndex][i % numOptions]) {
            options.push({
              text: columnOptions[columnIndex][i % numOptions],
              value: i,
              code: this.schoolList[j].code,
              id: this.schoolList[j].id
            })
          }
        }
      } else {
        for (let j = 0; j < this.academyOptions; j++) {
          if (this.academyList[j].name == columnOptions[columnIndex][i % numOptions]) {
            options.push({
              text: columnOptions[columnIndex][i % numOptions],
              value: i,
              code: this.academyList[j].code,
              id: this.academyList[j].id
            })
          }
        }
      }

      // options.push({
      //   text: columnOptions[columnIndex][i % numOptions],
      //   value: i,
      // })
    }
    return options;
  }

}
