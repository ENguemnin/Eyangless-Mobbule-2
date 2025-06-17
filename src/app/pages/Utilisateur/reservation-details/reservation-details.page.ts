import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonBadge,
  IonModal,
  IonItem,
  IonLabel,
  ActionSheetController,
  LoadingController,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  informationCircleOutline,
  cameraOutline,
  imagesOutline,
  downloadOutline,
  checkmarkCircleOutline,
  closeOutline
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  receiptImage?: string;
  receiptFileName?: string;
  receiptVerified?: boolean;
}

@Component({
  selector: 'app-reservation-details',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/reservations" color="primary"></ion-back-button>
        </ion-buttons>
        <ion-title>Détails de la réservation</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="details-content">
      <!-- Alerte de paiement (si non payée) -->
      <div class="payment-alert" *ngIf="reservation && reservation.status === 'reservee'">
        <div class="alert-icon">
          <ion-icon name="information-circle-outline"></ion-icon>
        </div>
        <div class="alert-content">
          <p><strong>Cette chambre n'a pas encore été payée</strong></p>
          <p>Il vous reste <strong>7 jours</strong> pour valider le paiement</p>
        </div>
      </div>

      <!-- Informations de la réservation -->
      <div class="reservation-info-section" *ngIf="reservation">
        <div class="section-header">
          <h2>{{ reservation.cityName }}</h2>
          <p class="reservation-date">{{ reservation.date }}</p>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Numéro de chambre</span>
            <span class="info-value">{{ reservation.roomId }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Étage</span>
            <span class="info-value">{{ reservation.floor.toUpperCase() }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Statut</span>
            <ion-badge 
              [color]="getStatusColor(reservation.status)"
              class="status-badge"
            >
              {{ getStatusText(reservation.status) }}
            </ion-badge>
          </div>
        </div>

        <!-- Informations sur le paiement -->
        <div class="payment-info-section">
          <h3>Informations sur le paiement</h3>
          
          <div class="payment-grid">
            <div class="payment-item">
              <span class="payment-label">Montant</span>
              <span class="payment-value amount">{{ getDisplayAmount() }} Fcfa</span>
            </div>

            <div class="payment-item">
              <span class="payment-label">Mode de paiement</span>
              <span class="payment-value">{{ reservation.paymentMethod }}</span>
            </div>

            <div class="payment-item">
              <span class="payment-label">Date de réservation</span>
              <span class="payment-value">{{ formatDate(reservation.timestamp) }}</span>
            </div>

            <div class="payment-item">
              <span class="payment-label">Titulaire</span>
              <span class="payment-value">{{ reservation.responsibleName }}</span>
            </div>
          </div>
        </div>

        <!-- Section validation de réservation -->
        <div class="validation-section">
          <h3>Valider la réservation</h3>
          <p class="validation-subtitle">Valider la réservation avec une photo du reçu</p>

          <!-- Zone d'upload ou image uploadée -->
          <div class="upload-section" *ngIf="!reservation.receiptImage">
            <div class="upload-zone" (click)="selectReceiptImage()">
              <ion-icon name="camera-outline"></ion-icon>
              <span>Ajouter une image</span>
            </div>
          </div>

          <!-- Image uploadée -->
          <div class="uploaded-receipt" *ngIf="reservation.receiptImage">
            <img [src]="reservation.receiptImage" alt="Reçu de paiement" />
            <div class="receipt-info">
              <p class="receipt-filename">{{ reservation.receiptFileName }}</p>
              <a 
                href="#" 
                class="verification-link"
                [class.verified]="reservation.receiptVerified"
                (click)="$event.preventDefault()"
              >
                {{ reservation.receiptVerified ? 'Vérifié' : 'En attente de vérification' }}
              </a>
            </div>
          </div>

          <!-- Bouton de validation -->
          <ion-button 
            expand="block" 
            color="primary" 
            class="validate-button"
            [disabled]="!reservation.receiptImage || reservation.status === 'payee'"
            (click)="validateReservation()"
            *ngIf="reservation.status === 'reservee'"
          >
            Valider la réservation
          </ion-button>
        </div>

        <!-- Section contrat de bail -->
        <div class="contract-section" *ngIf="reservation.status === 'payee'">
          <h3>Contrat de bail</h3>
          <p class="contract-subtitle">Télécharger et signer le contrat de bail</p>

          <div class="contract-preview">
            <div class="contract-icon">📄</div>
            <div class="contract-info">
              <p class="contract-title">Contrat de bail - {{ reservation.cityName }}</p>
              <p class="contract-description">Document PDF à signer</p>
            </div>
            <ion-button 
              color="success" 
              size="small"
              (click)="downloadContract()"
            >
              <ion-icon name="download-outline" slot="start"></ion-icon>
              Télécharger
            </ion-button>
          </div>

          <div class="contract-instructions">
            <p>
              Il faudra le scanner et le renvoyer au propriétaire pour signature des 2 partis.
            </p>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Modal de confirmation -->
    <ion-modal [isOpen]="showConfirmationModal" (didDismiss)="closeConfirmation()">
      <ng-template>
        <div class="confirmation-modal">
          <div class="confirmation-icon">
            <ion-icon name="checkmark-circle-outline"></ion-icon>
          </div>
          <h2>Réservation confirmée</h2>
          <div class="confirmation-content">
            <p><strong>Votre réservation a été validée avec succès</strong></p>
            <p>Votre réservation a effectivement été prise en compte.</p>
            <p>Vous pouvez consulter le contrat de bail dans l'onglet réservation.</p>
            <p>Il faudra le scanner et le renvoyer au propriétaire pour signature des 2 partis.</p>
          </div>
          <ion-button color="primary" (click)="closeConfirmation()">OK</ion-button>
        </div>
      </ng-template>
    </ion-modal>
  `,
  styles: [`
    :host {
      --primary-color: #1dd1a1;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --info-color: #3b82f6;
      --text-primary: #374151;
      --text-secondary: #6b7280;
      --background: #ffffff;
      --border-color: #e5e7eb;
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
    .details-content {
      --background: #f8f9fa;
      --padding-bottom: 20px;
    }

    /* Alerte de paiement */
    .payment-alert {
      background: #dcfce7;
      border: 1px solid #16a34a;
      border-radius: 12px;
      margin: 16px;
      padding: 16px;
      display: flex;
      gap: 12px;
    }

    .alert-icon {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .alert-icon ion-icon {
      font-size: 20px;
      color: #16a34a;
    }

    .alert-content p {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #15803d;
    }

    .alert-content p:last-child {
      margin-bottom: 0;
    }

    /* Section d'informations */
    .reservation-info-section {
      background: white;
      margin: 16px;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      margin-bottom: 24px;
      text-align: center;
    }

    .section-header h2 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .reservation-date {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
    }

    /* Grille d'informations */
    .info-grid {
      display: grid;
      gap: 16px;
      margin-bottom: 32px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-label {
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .info-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .status-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 16px;
    }

    /* Section paiement */
    .payment-info-section {
      margin-bottom: 32px;
    }

    .payment-info-section h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .payment-grid {
      display: grid;
      gap: 12px;
    }

    .payment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .payment-label {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .payment-value {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .payment-value.amount {
      color: var(--success-color);
      font-weight: 600;
    }

    /* Section validation */
    .validation-section {
      margin-bottom: 32px;
    }

    .validation-section h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .validation-subtitle {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: var(--text-secondary);
    }

    /* Zone d'upload */
    .upload-zone {
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 16px;
    }

    .upload-zone:hover {
      border-color: var(--primary-color);
      background: #f0fdf4;
    }

    .upload-zone ion-icon {
      font-size: 32px;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .upload-zone span {
      display: block;
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    /* Reçu uploadé */
    .uploaded-receipt {
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .uploaded-receipt img {
      width: 100%;
      max-height: 200px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .receipt-info {
      text-align: center;
    }

    .receipt-filename {
      margin: 0 0 8px 0;
      font-size: 12px;
      color: var(--text-secondary);
      font-family: monospace;
    }

    .verification-link {
      font-size: 14px;
      color: var(--info-color);
      text-decoration: none;
      font-weight: 500;
    }

    .verification-link.verified {
      color: var(--success-color);
    }

    /* Bouton de validation */
    .validate-button {
      --border-radius: 12px;
      --padding-top: 16px;
      --padding-bottom: 16px;
      height: 56px;
      font-weight: 600;
    }

    .validate-button:disabled {
      --background: #d1d5db;
      --color: #9ca3af;
    }

    /* Section contrat */
    .contract-section h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .contract-subtitle {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .contract-preview {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    .contract-icon {
      font-size: 32px;
      flex-shrink: 0;
    }

    .contract-info {
      flex: 1;
    }

    .contract-title {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .contract-description {
      margin: 0;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .contract-instructions {
      padding: 12px;
      background: #fffbeb;
      border-radius: 8px;
      border: 1px solid #fbbf24;
    }

    .contract-instructions p {
      margin: 0;
      font-size: 12px;
      color: #92400e;
      line-height: 1.4;
    }

    /* Modal de confirmation */
    .confirmation-modal {
      padding: 40px 24px;
      text-align: center;
    }

    .confirmation-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #1f2937;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .confirmation-icon ion-icon {
      font-size: 40px;
      color: var(--success-color);
    }

    .confirmation-modal h2 {
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .confirmation-content {
      margin-bottom: 24px;
    }

    .confirmation-content p {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .confirmation-content p:last-child {
      margin-bottom: 0;
    }

    .confirmation-modal ion-button {
      --border-radius: 12px;
      --padding-top: 12px;
      --padding-bottom: 12px;
      font-weight: 600;
      min-width: 120px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .reservation-info-section {
        margin: 12px;
        padding: 16px;
      }

      .payment-alert {
        margin: 12px;
        padding: 12px;
      }

      .contract-preview {
        flex-direction: column;
        text-align: center;
      }

      .confirmation-modal {
        padding: 24px 20px;
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
    IonBackButton,
    IonButton,
    IonIcon,
    IonBadge,
    IonModal,
    IonItem,
    IonLabel
  ]
})
export class ReservationDetailsPage implements OnInit {
  reservation?: Reservation;
  showConfirmationModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({
      chevronBackOutline,
      informationCircleOutline,
      cameraOutline,
      imagesOutline,
      downloadOutline,
      checkmarkCircleOutline,
      closeOutline
    });
  }

  ngOnInit() {
    const reservationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadReservation(reservationId);
  }

  private loadReservation(id: number) {
    const savedReservations = localStorage.getItem('userReservations');
    if (savedReservations) {
      const reservations: Reservation[] = JSON.parse(savedReservations);
      this.reservation = reservations.find(r => r.id === id);
    }
  }

  getDisplayAmount(): string {
    if (!this.reservation) return '0';
    
    // Si payée, afficher 5.000, sinon 10.000
    const amount = this.reservation.status === 'payee' ? 5000 : this.reservation.amount;
    return amount.toLocaleString();
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

  async selectReceiptImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ajouter une photo du reçu',
      buttons: [
        {
          text: 'Prendre une photo',
          icon: 'camera-outline',
          handler: () => {
            this.takePhoto();
          }
        },
        {
          text: 'Choisir dans la galerie',
          icon: 'images-outline',
          handler: () => {
            this.selectFromGallery();
          }
        },
        {
          text: 'Annuler',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  private async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image.dataUrl && this.reservation) {
        this.reservation.receiptImage = image.dataUrl;
        this.reservation.receiptFileName = `IMG${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
        this.reservation.receiptVerified = false;
        this.saveReservation();
        await this.showToast('Photo ajoutée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      await this.showToast('Erreur lors de la prise de photo', 'danger');
    }
  }

  private async selectFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      if (image.dataUrl && this.reservation) {
        this.reservation.receiptImage = image.dataUrl;
        this.reservation.receiptFileName = `IMG${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
        this.reservation.receiptVerified = false;
        this.saveReservation();
        await this.showToast('Photo ajoutée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de photo:', error);
      await this.showToast('Erreur lors de la sélection de photo', 'danger');
    }
  }

  async validateReservation() {
    if (!this.reservation || !this.reservation.receiptImage) {
      await this.showToast('Veuillez ajouter une photo du reçu', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Validation en cours...',
      duration: 2000
    });
    await loading.present();

    setTimeout(() => {
      if (this.reservation) {
        this.reservation.status = 'payee';
        this.reservation.receiptVerified = true;
        this.saveReservation();
      }
      
      loading.dismiss();
      this.showConfirmationModal = true;
    }, 2000);
  }

  private saveReservation() {
    if (!this.reservation) return;

    const savedReservations = localStorage.getItem('userReservations');
    if (savedReservations) {
      const reservations: Reservation[] = JSON.parse(savedReservations);
      const index = reservations.findIndex(r => r.id === this.reservation!.id);
      if (index !== -1) {
        reservations[index] = this.reservation;
        localStorage.setItem('userReservations', JSON.stringify(reservations));
      }
    }
  }

  closeConfirmation() {
    this.showConfirmationModal = false;
  }

  async downloadContract() {
    const loading = await this.loadingController.create({
      message: 'Génération du contrat...',
      duration: 1500
    });
    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();
      await this.showToast('Contrat téléchargé avec succès');
      
      // Ici vous pourriez implémenter le téléchargement réel du PDF
      console.log('Téléchargement du contrat pour:', this.reservation?.cityName);
    }, 1500);
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}