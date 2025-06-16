import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonLabel, IonItem, IonThumbnail, IonButton, IonAvatar, IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonAvatar, RouterLink, IonButton, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonThumbnail, FormsModule],
})
export class HomePage {

  constructor() {}

}
