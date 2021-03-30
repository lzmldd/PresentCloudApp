import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-success',
  templateUrl: './create-success.page.html',
  styleUrls: ['./create-success.page.scss'],
})
export class CreateSuccessPage implements OnInit {

  // 生成二维码定义变量
  lessonCode = '';
  createdCode: string;  //要生成的二维码内容变量
  flag = '0';
  public value = '1';
  
  constructor() { }

  ngOnInit() {
  }

}
