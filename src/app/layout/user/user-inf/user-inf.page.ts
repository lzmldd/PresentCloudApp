import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-inf',
  templateUrl: './user-inf.page.html',
  styleUrls: ['./user-inf.page.scss'],
})
export class UserInfPage implements OnInit {

  public user = {
    email: localStorage.getItem("email"),
    image: "1",
    role: "",
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
