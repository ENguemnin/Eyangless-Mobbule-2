import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonLabel, IonTabButton, IonTabBar, IonTabs, IonButton, IonBadge, IonAvatar, IonButtons, IonBackButton, IonMenuButton, IonSearchbar } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { search, location } from 'ionicons/icons';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
  standalone: true,
  imports: [IonSearchbar, RouterLink, IonBackButton, IonButtons, IonAvatar, IonBadge, IonButton, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton]
})
export class AccueilPage implements OnInit {
cite = {
    nom: 'Cité Shékina',
    type: 'Cité moderne',
    image: 'assets/images/cite-shekina.jpg',
    chambresPrivees: 13,
    chambresDisponibles: 15,
    reservationsEnAttente: 4,
    commentaires: 23
  };

  reservations = [
    {
      id: 1,
      chambre: 'Chambre A2',
      prix: '70.000 FCFA',
      client: 'Anaïs FREDA',
      avatar: 'assets/avatars/anais.jpg',
      hasNotification: true
    },
    {
      id: 2,
      chambre: 'Chambre A3',
      prix: '70.000 FCFA',
      client: 'Anaïs FREDA',
      avatar: 'assets/avatars/anais.jpg',
      hasNotification: false
    },
    {
      id: 3,
      chambre: 'Chambre B4',
      prix: '70.000 FCFA',
      client: 'Anaïs FREDA',
      avatar: 'assets/avatars/anais.jpg',
      hasNotification: false
    },
    {
      id: 4,
      chambre: 'Chambre A10',
      prix: '70.000 FCFA',
      client: 'Anaïs FREDA',
      avatar: 'assets/avatars/anais.jpg',
      hasNotification: false
    }
  ];

  commentaires = [
    {
      id: 1,
      auteur: 'Roy',
      message: 'Je ne sais même pas ce que je peux dire sur cette cité, parce que je ne l\'aime pas vraiment.',
      couleur: '#00BCD4'
    },
    {
      id: 2,
      auteur: 'Anonyme',
      message: 'Anonymement, je laisse une bonne note à cette cité pour son libertinage absolu.',
      couleur: '#4CAF50'
    }
  ];

  showAllComments = false;

  constructor(private route: ActivatedRoute) {
    addIcons({search, location});
   }

  ngOnInit() {
    // Récupérer l'ID de la cité depuis les paramètres de route si nécessaire
    const citeId = this.route.snapshot.paramMap.get('id');
  }

  voirSurCarte() {
    // Navigation vers la carte
    console.log('Voir sur la carte');
  }

  voirChambres() {
    // Navigation vers la liste des chambres
    console.log('Voir les chambres');
  }

  voirReservations() {
    // Navigation vers toutes les réservations
    console.log('Voir toutes les réservations');
  }

  voirCommentaires() {
    // Navigation vers tous les commentaires
    console.log('Voir tous les commentaires');
  }

  voirPlus() {
    // Voir plus de réservations
    console.log('Voir plus de réservations');
  }

  toggleComments() {
    this.showAllComments = !this.showAllComments;
  }

  chargerPlus() {
    // Charger plus de commentaires
    console.log('Charger plus de commentaires');
  }

}
