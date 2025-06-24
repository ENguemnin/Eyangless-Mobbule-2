import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-chambres',
  templateUrl: './chambres.page.html',
  styleUrls: ['./chambres.page.scss'],
  standalone: true,
  imports: [RouterLink, IonMenuButton, IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChambresPage implements OnInit {

  constructor() { }

  ngOnInit() {
    return
  }

}
