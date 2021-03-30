import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.page.html',
  styleUrls: ['./add-lesson.page.scss'],
})
export class AddLessonPage implements OnInit {

  lesson = {
    type: "1",
    name: "",
    description: ""
  }

  constructor() { }

  ngOnInit() {
  }

}
