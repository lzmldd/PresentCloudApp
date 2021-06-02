import { HttpServiceService } from './../../../shared/services/http-service.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lesson-school',
  templateUrl: './lesson-school.page.html',
  styleUrls: ['./lesson-school.page.scss'],
})
export class LessonSchoolPage implements OnInit {
  school = [[], [], []]// 学校名，id，院系列表
  academy = [[], []]// 学院名，id列表
  public index = 0;
  public flag = 0;
  public selectedSchoolName = ""// 选择的学校名
  public selectedAcademyName = ""// 选择的学院名
  public selectedSchoolId = -1;// 选择的学校id
  public selectedAcademyId = -1;// 选择的学院id

  public property: any;
  public title: any;
  public pageNum: any;
  public name: "";// 输入的值
  public id: "";// 输入的值
  constructor(private activatedRoute: ActivatedRoute,
    public httpService: HttpServiceService,
    public router: Router,
    public toastCtrl: ToastController,) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.property = queryParams.property;
      this.title = queryParams.title;
      this.pageNum = queryParams.pageNum;
    });
  }


  ngOnInit() {
    if (this.title == '选择学校') {
      // 获取所有的学校列表
      var api = '/common/school/tree' //获得各学校及其学院列表
      this.httpService.getAll(api).then(async (response: any) => {

        for (var i = 0; i < response.data.length; i++) {
          this.school[0].push(response.data[i].name);
          this.school[1].push((response.data[i].id));
          this.school[2].push((response.data[i].departments));
        }
        console.log(this.school)
      })
    }

  }

  ionViewWillEnter() {


  }
  selectSchool(index) {
    this.selectedSchoolName = this.school[0][index]
    this.selectedSchoolId = this.school[1][index]
    console.log(this.selectedSchoolName, this.selectedSchoolId)
    console.log(this.school[2][index])
    this.academy = [[], []]
    for (var i = 0; i < this.school[2][index].length; i++) {
      this.academy[0].push(this.school[2][index][i].name);
      this.academy[1].push(this.school[2][index][i].id);
    }
    console.log(this.academy)
  }

  selectAcademy(index) {
    this.selectedAcademyName = this.academy[0][index]
    this.selectedAcademyId = this.academy[1][index]
    console.log(this.selectedAcademyName, this.selectedAcademyId)

  }
  async complete() {
    if (this.selectedAcademyId == -1) {
      const toast = await this.toastCtrl.create({
        message: '你还没有选择院系', // 弹出输入不能为空的文本框
        duration: 2000
      });
      toast.present();
    }
    else if (this.pageNum == '0') {
      this.name = ""
      this.id = ""
      this.name += this.selectedSchoolName + " " + this.selectedAcademyName
      this.id += this.selectedSchoolId + '/' + this.selectedAcademyId
      console.log(this.name, this.id)
      this.router.navigate(['create-lesson'], { queryParams: { name: this.name, id: this.id, pageNum: this.pageNum } });
    }
    else if (this.pageNum == '5') {
      this.name = ""
      this.id = ""
      this.name += this.selectedSchoolName + " " + this.selectedAcademyName
      this.id += this.selectedSchoolId + '/' + this.selectedAcademyId
      console.log(this.name, this.id)
      this.router.navigate(['user-info'], { queryParams: { name: this.name, id: this.id, pageNum: this.pageNum } });
    }
    else if (this.pageNum == '6') {
      this.name = ""
      this.id = ""
      this.name += this.selectedSchoolName + " " + this.selectedAcademyName
      this.id += this.selectedSchoolId + '/' + this.selectedAcademyId
      console.log(this.name, this.id)
      this.router.navigate(['detail'], { queryParams: { name: this.name, id: this.id, pageNum: this.pageNum } });
    }
  }

}
