import { HttpServiceService } from './../../../../shared/services/http-service.service';
import { AlertController, PickerController, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {

  public user = {
    userFace: "",
    phone: localStorage.getItem("phone"),
    roleId: localStorage.getItem("role_id"),
    exp: 0,
    name: "",
    nickname: "",
    number: "",// 学号
    birthday: "",
    sexCode: null,
    school: null,
    department: null,
    schoolId: null,// user的学校id
    departmentId: null,// user的学院id
    // 先后台提供schoolId和departmentId即可更新用户信息的school和department
  };
  public selectedName = "请选择"// 选择的学校名
  public selectedId = ""
  public isTeacher;

  constructor(public router: Router,
    public httpService: HttpServiceService,
    public http: HttpClient,
    private alertController: AlertController,
    public pickerController: PickerController,
    public toast: ToastController,
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,) {

    activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.pageNum == '5') {
        console.log(queryParams.name, queryParams.id)
        console.log(queryParams.id.split("/"))
        this.selectedName = queryParams.name
        this.selectedId = queryParams.id
        localStorage.setItem("recent_selectedName", this.selectedName)

      }
    });

  }

  ngOnInit() {
    this.selectedName == "请选择"
    this.getInf()
  }
  ionViewWillEnter() {
    // this.selectedName == "请选择"
    // this.getInf()
  }
  ionViewWillLeave() {
    // this.selectedName == "请选择"
    // this.getInf()
  }
  //获取个人信息
  async getInf() {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    var api = '/common/user/info';//后台接口
    this.httpService.getAll(api).then(async (response: any) => {
      if (response.status == 200) {
        this.user = response.data;
        console.log(this.user)
        if (this.user.roleId == "2") {
          this.isTeacher = "(教师)";
        } else {
          this.isTeacher = "(学生)";
        }
        localStorage.setItem("role_id", response.data.roleId);
        localStorage.setItem("user_id", response.data.id);
        localStorage.setItem("phone", response.data.phone);
        // 获取用户的学校和学院名
        if (this.selectedName == "请选择") {
          this.selectedName = this.user.school.name + ' ' + this.user.department.name
        }
        this.user.sexCode = response.data.sexCode.toString();
        // this.user["phone"] = localStorage.getItem("phone");
        if (response.data.roleId == 2) {
          this.isTeacher = "(教师)";
        } else {
          this.isTeacher = "(学生)";
        }

        if (response.data.name == 0) {
          this.user.name = "";
        }
        if (response.data.nickname == 0) {
          this.user.nickname = "";
        }
        if (response.data.number == 0) {
          this.user.number = "";
        }

        await loading.dismiss();
      }
    })

  }

  // 更新个人信息
  updateInf() {
    // 更新user中的schoolid和departmentid
    this.user.schoolId = this.selectedId.split('/')[0]
    this.user.departmentId = this.selectedId.split('/')[1]
    var params = this.user
    params["createTime"] = null//createTime要置空，否则报错
    console.log(params);
    var api = '/common/user/edit';//后台接口
    this.httpService.put(api, params).then(async (response: any) => {
      // console.log(response);
      if (response.data.message == "该手机号已被绑定") {
        const toast = await this.toast.create({
          message: '改手机号已被使用',
          duration: 2000
        });
        toast.present();
      } else if (response.data.code == 200) {
        // let alert = await this.alertController.create({
        //   header: '提示',
        //   message: '修改成功！',
        //   buttons: ['确认']
        // });
        // alert.present();
        const toast = await this.toast.create({
          message: '修改成功！',
          duration: 2000
        });
        toast.present();
        this.router.navigateByUrl('/home-tabs/my');
      }

    })
  }


}
