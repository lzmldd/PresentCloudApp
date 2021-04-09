import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {

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

  constructor() { }

  ngOnInit() {
  }

}
