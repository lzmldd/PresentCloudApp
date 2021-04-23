import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss'],
})
export class CheckinComponent implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() { }
  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
