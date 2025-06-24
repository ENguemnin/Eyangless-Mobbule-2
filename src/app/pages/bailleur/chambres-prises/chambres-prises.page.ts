import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonIcon, IonButton, IonBackButton, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-chambres-prises',
  templateUrl: './chambres-prises.page.html',
  styleUrls: ['./chambres-prises.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButton, IonIcon, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChambresPrisesPage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    return
  }

  goBack() {
    this.navCtrl.back();
  }
}
