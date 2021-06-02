import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, PickerController, ToastController } from '@ionic/angular';
import { HttpServiceService } from './../../../shared/services/http-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lesson-info-edit',
  templateUrl: './lesson-info-edit.page.html',
  styleUrls: ['./lesson-info-edit.page.scss'],
})
export class LessonInfoEditPage implements OnInit {
  public lesson = {
    picture: '',
    className: '计算机专硕1班',
    name: '工程训练',
    term: '2019-2020-1',
    flag: 1,
  };
  term = [[]];
  termOptions = 7;

  constructor(
    public httpService: HttpServiceService,
    // public http: HttpClient,
    public alertController: AlertController,
    public router: Router,
    public pickerController: PickerController,
    public activatedRoute: ActivatedRoute,
    public toastController: ToastController,
  ) {
  }

  ngOnInit() {
    this.getLesson();
    this.getTime();
  }

  getLesson() {
    var api = '/course/manage/' + localStorage.getItem("course_id");
    this.httpService.getAll(api).then(async (response: any) => {
      this.lesson = response.data.obj;
      // console.log(this.lesson);
    })
  }

  onUpdate() {
    // console.log(this.lesson.flag)
    if (this.lesson.flag) {
      this.lesson.flag = 1
    }
    else {
      this.lesson.flag = 0
    }
    var params = {
      id: localStorage.getItem("course_id"),
      className: this.lesson.className,
      name: this.lesson.name,
      term: this.lesson.term,
      flag: this.lesson.flag
    }
    // console.log(params)
    var api = '/course/manage/';
    this.httpService.put(api, params).then(async (response: any) => {
      if (response.data.message=="修改班课成功") {
        this.presentToast('修改班课成功')
        this.router.navigate(['/lesson-tabs/detail'], {
          queryParams: {
            className: this.lesson.className,
            name: this.lesson.name,
            term: this.lesson.term,
            flag: this.lesson.flag
          }
        })
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

  getTime() {
    let myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    for (var i = 0; i < 3; i++) {
      var start = year + i - 1;
      var end = start + 1;
      this.term[0].push(start + "-" + end + "-01");
      this.term[0].push(start + "-" + end + "-02");
    }
    this.term[0].push("不设置学期")
  }
  
  async termPicker(numColumns = 1, numOptions, columnOptions) {

    const picker = await this.pickerController.create({
      columns: this.getTermColumns(numColumns, numOptions, columnOptions),
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确认',
          handler: (value) => {
            this.lesson.term = value.col.text;
            // console.log(this.lesson.term);
          }
        }
      ]
    });

    await picker.present();
  }

  getTermColumns(numColumns, numOptions, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col`,
        options: this.getTermColumnOptions(i, numOptions, columnOptions)
      });
    }

    return columns;
  }

  getTermColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      })
    }

    return options;
  }

}
