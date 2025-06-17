import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonFooter,
  IonTabBar,
  IonTabButton,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline,
  chevronForwardOutline,
  homeOutline,
  businessOutline,
  mapOutline,
  personOutline,
  calendarOutline,
  cardOutline
} from 'ionicons/icons';

interface Reservation {
  id: number;
  cityName: string;
  date: string;
  roomId: string;
  floor: string;
  amount: number;
  paymentMethod: string;
  responsibleName: string;
  phoneNumber: string;
  status: 'reservee' | 'payee';
  timestamp: string;
}

@Component({
  selector: 'app-reservations',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Mes réservations</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="reservations-content">
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Liste des réservations -->
      <div class="reservations-list" *ngIf="reservations.length > 0">
        <div 
          *ngFor="let reservation of reservations; trackBy: trackByReservation"
          class="reservation-card"
          (click)="viewReservationDetails(reservation)"
        >
          <div class="reservation-header">
            <div class="reservation-info">
              <h3>{{ reservation.cityName }}</h3>
              <p class="reservation-date">{{ reservation.date }}</p>
            </div>
            <ion-icon name="chevron-forward-outline" color="medium"></ion-icon>
          </div>

          <div class="reservation-details">
            <div class="detail-row">
              <span class="detail-label">Mode de paiement</span>
              <span class="detail-value">{{ reservation.paymentMethod }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Responsable</span>
              <span class="detail-value">{{ reservation.responsibleName }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Date de réservation</span>
              <span class="detail-value">{{ formatDate(reservation.timestamp) }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Numéro de la chambre</span>
              <span class="detail-value">{{ reservation.roomId }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Montant</span>
              <span class="detail-value amount">{{ reservation.amount | number }} Fcfa</span>
            </div>
          </div>

          <div class="reservation-status">
            <ion-badge 
              [color]="getStatusColor(reservation.status)"
              class="status-badge"
            >
              {{ getStatusText(reservation.status) }}
            </ion-badge>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div class="empty-state" *ngIf="reservations.length === 0">
        <div class="empty-content">
          <div class="empty-icon">
            <ion-icon name="calendar-outline"></ion-icon>
          </div>
          <h3>Aucune réservation</h3>
          <p>Vous n'avez pas encore effectué de réservation</p>
          <ion-button color="primary" (click)="browseCities()">
            Parcourir les cités
          </ion-button>
        </div>
      </div>
    </ion-content>

    <!-- Footer avec navigation -->
    <ion-footer class="ion-no-border">
      <ion-tab-bar class="custom-tab-bar">
        <ion-tab-button (click)="navigateTo('/home')">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="navigateTo('/cities')">
          <ion-icon name="business-outline"></ion-icon>
          <ion-label>Cités</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="navigateTo('/map')">
          <ion-icon name="map-outline"></ion-icon>
          <ion-label>Carte</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="navigateTo('/profile')">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Mon compte</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-footer>
  `,
  styles: [`
    :host {
      --primary-color: #1dd1a1;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --text-primary: #374151;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      --background: #ffffff;
      --border-color: #e5e7eb;
      --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* Header */
    ion-header ion-toolbar {
      --background: white;
      --color: var(--text-primary);
    }

    ion-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Content */
    .reservations-content {
      --background: #f8f9fa;
    }

    /* Liste des réservations */
    .reservations-list {
      padding: 16px;
    }

    .reservation-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .reservation-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .reservation-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .reservation-info h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .reservation-date {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .reservation-details {
      margin-bottom: 16px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px dotted #e5e7eb;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .detail-value {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      text-align: right;
    }

    .detail-value.amount {
      color: var(--primary-color);
      font-weight: 600;
    }

    .reservation-status {
      display: flex;
      justify-content: flex-end;
    }

    .status-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 16px;
    }

    /* État vide */
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60vh;
      padding: 20px;
    }

    .empty-content {
      text-align: center;
      max-width: 300px;
    }

    .empty-icon {
      font-size: 64px;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    .empty-content h3 {
      margin: 16px 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .empty-content p {
      margin: 0 0 24px;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .empty-content ion-button {
      --border-radius: 12px;
      --padding-top: 12px;
      --padding-bottom: 12px;
      font-weight: 500;
    }

    /* Footer navigation */
    .custom-tab-bar {
      --background: white;
      --border: 1px solid var(--border-color);
      height: 60px;
      padding-bottom: env(safe-area-inset-bottom);
    }

    ion-tab-button {
      --color: var(--text-muted);
      --color-selected: var(--primary-color);
      font-size: 12px;
      flex-direction: column;
      gap: 4px;
    }

    ion-tab-button ion-icon {
      font-size: 22px;
    }

    ion-tab-button ion-label {
      font-size: 11px;
      font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .reservations-list {
        padding: 12px;
      }

      .reservation-card {
        padding: 16px;
        margin-bottom: 12px;
      }

      .reservation-header {
        margin-bottom: 12px;
      }

      .reservation-details {
        margin-bottom: 12px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
    IonIcon,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonRefresher,
    IonRefresherContent
  ]
})
export class ReservationsPage implements OnInit {
  reservations: Reservation[] = [];

  constructor(private router: Router) {
    addIcons({
      menuOutline,
      chevronForwardOutline,
      homeOutline,
      businessOutline,
      mapOutline,
      personOutline,
      calendarOutline,
      cardOutline
    });
  }

  ngOnInit() {
    this.loadReservations();
  }

  private loadReservations() {
    const savedReservations = localStorage.getItem('userReservations');
    if (savedReservations) {
      this.reservations = JSON.parse(savedReservations);
    }
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'reservee':
        return 'warning';
      case 'payee':
        return 'success';
      default:
        return 'medium';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'reservee':
        return 'Réservée';
      case 'payee':
        return 'Payée';
      default:
        return 'Inconnue';
    }
  }

  viewReservationDetails(reservation: Reservation) {
    this.router.navigate(['/reservation-details', reservation.id]);
  }

  browseCities() {
    this.router.navigate(['/cities']);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadReservations();
      event.target.complete();
    }, 1000);
  }

  trackByReservation(index: number, reservation: Reservation): number {
    return reservation.id;
  }
}