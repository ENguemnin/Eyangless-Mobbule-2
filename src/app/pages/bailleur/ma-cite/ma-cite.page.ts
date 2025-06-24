import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, IonButtons, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-ma-cite',
  templateUrl: './ma-cite.page.html',
  styleUrls: ['./ma-cite.page.scss'],
  standalone: true,
  imports: [IonLabel, IonSegmentButton, IonSegment, IonIcon, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonAvatar, RouterLink]
})
export class MaCitePage implements OnInit {
selectedTab: string = 'overview';

  constructor() { }

  ngOnInit() {
    return
  }

  onSegmentChanged(event: any) {
    this.selectedTab = event.detail.value;
  }

  // Méthode pour vérifier si un onglet est actif
  isTabActive(tabName: string): boolean {
    return this.selectedTab === tabName;
  }

  // Optionnel: Méthodes pour gérer les actions
  onShareClick() {
    // Logique pour partager
    console.log('Partager la cité');
  }

  onLocationClick() {
    // Logique pour voir sur la carte
    console.log('Voir sur la carte');
  }

  onGalleryImageClick(imageIndex: number) {
    // Logique pour ouvrir l'image en plein écran
    console.log('Image cliquée:', imageIndex);
  }

}
