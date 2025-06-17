import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonModal,
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  warningOutline,
  informationCircleOutline,
  closeOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

interface PaymentData {
  amount: number;
  paymentMethod: 'orange' | 'mtn';
  phoneNumber: string;
  responsibleName: string;
}

@Component({
  selector: 'app-reservation-payment',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/room-selection" color="primary"></ion-back-button>
        </ion-buttons>
        <ion-title>Frais de réservation</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="payment-content">
      <!-- Sous-titre -->
      <div class="subtitle-section">
        <p>Procéder à la réservation de votre chambre</p>
      </div>

      <!-- Alerte délai -->
      <div class="delay-alert">
        <div class="alert-icon">
          <ion-icon name="warning-outline"></ion-icon>
        </div>
        <div class="alert-content">
          <h3>Délai de 7 jours (1 semaine)</h3>
          <p>
            Une fois les frais de réservation payés, vous disposerez d'un délai de 
            <strong>7 jours</strong> pour payer le montant requis pour valider votre location.
          </p>
          <p>
            Passé ce délai et votre chambre sera de nouveau libre et réservable par d'autres utilisateurs.
          </p>
        </div>
      </div>

      <!-- Formulaire de réservation -->
      <div class="form-section">
        <h2>Formulaire de réservation</h2>

        <!-- Frais de réservation -->
        <div class="amount-section">
          <div class="amount-item">
            <span class="amount-label">Frais de réservation</span>
            <span class="amount-value">{{ paymentData.amount | number }} FCFA</span>
          </div>
        </div>

        <!-- Mode de paiement -->
        <div class="payment-method-section">
          <h3>Mode de paiement</h3>
          <ion-radio-group [(ngModel)]="paymentData.paymentMethod">
            <div class="payment-option" [class.selected]="paymentData.paymentMethod === 'orange'">
              <ion-radio slot="start" value="orange"></ion-radio>
              <div class="payment-info">
                <div class="payment-logo orange">🟠</div>
                <span>Orange Money</span>
              </div>
            </div>
            
            <div class="payment-option" [class.selected]="paymentData.paymentMethod === 'mtn'">
              <ion-radio slot="start" value="mtn"></ion-radio>
              <div class="payment-info">
                <div class="payment-logo mtn">📱</div>
                <span>MTN Mobile Money</span>
              </div>
            </div>
          </ion-radio-group>
        </div>

        <!-- Champs de saisie -->
        <div class="input-section">
          <div class="input-group">
            <ion-label class="input-label">Numéro de téléphone pour le dépôt</ion-label>
            <ion-item class="input-item">
              <ion-input
                [(ngModel)]="paymentData.phoneNumber"
                placeholder="Entrer un numéro de téléphone"
                type="tel"
                maxlength="9"
              ></ion-input>
            </ion-item>
          </div>

          <div class="input-group">
            <ion-label class="input-label">Paiement au nom de</ion-label>
            <ion-item class="input-item">
              <ion-input
                [(ngModel)]="paymentData.responsibleName"
                placeholder="Entrer le nom du responsable de la réservation"
                type="text"
              ></ion-input>
            </ion-item>
          </div>
        </div>

        <!-- Information supplémentaire -->
        <div class="info-note">
          <ion-icon name="information-circle-outline"></ion-icon>
          <span>Aucun frais supplémentaire ne sera débité</span>
        </div>

        <!-- Bouton de soumission -->
        <ion-button 
          expand="block" 
          color="primary" 
          class="submit-button"
          [disabled]="!isFormValid()"
          (click)="showSummary()"
        >
          Soumettre
        </ion-button>
      </div>
    </ion-content>

    <!-- Modal Résumé de la facture -->
    <ion-modal [isOpen]="showSummaryModal" (didDismiss)="closeSummary()">
      <ng-template>
        <div class="summary-modal">
          <div class="modal-header">
            <h2>Résumé de la facture</h2>
            <ion-button fill="clear" size="small" (click)="closeSummary()">
              <ion-icon name="close-outline"></ion-icon>
            </ion-button>
          </div>

          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Frais de réservation</span>
              <span class="summary-value primary">{{ paymentData.amount | number }} FCFA</span>
            </div>

            <div class="summary-item">
              <span class="summary-label">Mode de paiement</span>
              <span class="summary-value">{{ getPaymentMethodName() }}</span>
            </div>

            <div class="summary-item">
              <span class="summary-label">Numéro de paiement</span>
              <span class="summary-value">{{ formatPhoneNumber() }}</span>
            </div>

            <div class="summary-item">
              <span class="summary-label">Paiement au nom de</span>
              <span class="summary-value">{{ paymentData.responsibleName }}</span>
            </div>
          </div>

          <ion-button 
            expand="block" 
            color="primary" 
            class="pay-button"
            (click)="processPayment()"
          >
            Payer
          </ion-button>
        </div>
      </ng-template>
    </ion-modal>

    <!-- Modal Success -->
    <ion-modal [isOpen]="showSuccessModal" (didDismiss)="closeSuccess()">
      <ng-template>
        <div class="result-modal success">
          <div class="result-icon">
            <ion-icon name="checkmark-circle-outline"></ion-icon>
          </div>
          <h2>Paiement effectué avec succès</h2>
          <p>Votre réservation a été enregistrée avec succès</p>
          <ion-button color="primary" (click)="goToReservations()">OK</ion-button>
        </div>
      </ng-template>
    </ion-modal>

    <!-- Modal Échec -->
    <ion-modal [isOpen]="showErrorModal" (didDismiss)="closeError()">
      <ng-template>
        <div class="result-modal error">
          <div class="result-icon error">
            <ion-icon name="close-outline"></ion-icon>
          </div>
          <h2>Échec du paiement</h2>
          <p>Quelque chose s'est mal passé</p>
          <div class="error-actions">
            <ion-button fill="outline" color="medium" (click)="closeError()">Annuler</ion-button>
            <ion-button color="primary" (click)="retryPayment()">Réessayer</ion-button>
          </div>
        </div>
      </ng-template>
    </ion-modal>
  `,
  styles: [`
    :host {
      --primary-color: #1dd1a1;
      --warning-color: #f59e0b;
      --success-color: #10b981;
      --error-color: #ef4444;
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
    .payment-content {
      --background: #f8f9fa;
      --padding-bottom: 20px;
    }

    .subtitle-section {
      background: white;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color);
    }

    .subtitle-section p {
      margin: 0;
      font-size: 16px;
      color: var(--text-secondary);
      text-align: center;
    }

    /* Alerte délai */
    .delay-alert {
      background: #fef3c7;
      border: 1px solid #fbbf24;
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
      color: #d97706;
    }

    .alert-content h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #92400e;
    }

    .alert-content p {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #92400e;
      line-height: 1.5;
    }

    .alert-content p:last-child {
      margin-bottom: 0;
    }

    /* Section formulaire */
    .form-section {
      background: white;
      margin: 16px;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-section h2 {
      margin: 0 0 24px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Section montant */
    .amount-section {
      margin-bottom: 24px;
    }

    .amount-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }

    .amount-label {
      font-size: 16px;
      color: var(--text-primary);
      font-weight: 500;
    }

    .amount-value {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
    }

    /* Mode de paiement */
    .payment-method-section {
      margin-bottom: 24px;
    }

    .payment-method-section h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .payment-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .payment-option.selected {
      border-color: var(--primary-color);
      background: #f0fdf4;
    }

    .payment-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .payment-logo {
      font-size: 20px;
    }

    .payment-info span {
      font-size: 16px;
      font-weight: 500;
      color: var(--text-primary);
    }

    /* Section de saisie */
    .input-section {
      margin-bottom: 24px;
    }

    .input-group {
      margin-bottom: 20px;
    }

    .input-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .input-item {
      --background: #f8f9fa;
      --border-color: var(--border-color);
      --border-radius: 8px;
      --border-width: 1px;
      --border-style: solid;
      --padding-start: 16px;
      --padding-end: 16px;
      --min-height: 48px;
      margin: 0;
    }

    .input-item ion-input {
      --color: var(--text-primary);
      --placeholder-color: #9ca3af;
      font-size: 14px;
    }

    /* Note d'information */
    .info-note {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      padding: 12px;
      background: #f0f9ff;
      border-radius: 8px;
    }

    .info-note ion-icon {
      font-size: 16px;
      color: #0284c7;
    }

    .info-note span {
      font-size: 14px;
      color: #0284c7;
    }

    /* Bouton de soumission */
    .submit-button {
      --border-radius: 12px;
      --padding-top: 16px;
      --padding-bottom: 16px;
      height: 56px;
      font-weight: 600;
      margin-top: 8px;
    }

    .submit-button:disabled {
      --background: #d1d5db;
      --color: #9ca3af;
    }

    /* Modals */
    .summary-modal {
      padding: 24px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .summary-content {
      margin-bottom: 24px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .summary-label {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .summary-value {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .summary-value.primary {
      color: var(--primary-color);
      font-weight: 600;
    }

    .pay-button {
      --border-radius: 12px;
      --padding-top: 16px;
      --padding-bottom: 16px;
      height: 56px;
      font-weight: 600;
    }

    /* Modals de résultat */
    .result-modal {
      padding: 40px 24px;
      text-align: center;
    }

    .result-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      background: #1f2937;
    }

    .result-icon ion-icon {
      font-size: 40px;
      color: var(--success-color);
    }

    .result-icon.error {
      background: var(--error-color);
    }

    .result-icon.error ion-icon {
      color: white;
    }

    .result-modal h2 {
      margin: 0 0 12px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .result-modal p {
      margin: 0 0 24px 0;
      font-size: 16px;
      color: var(--text-secondary);
    }

    .error-actions {
      display: flex;
      gap: 12px;
    }

    .error-actions ion-button {
      flex: 1;
      --border-radius: 8px;
      height: 48px;
      font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .form-section {
        margin: 12px;
        padding: 16px;
      }

      .delay-alert {
        margin: 12px;
        padding: 12px;
      }

      .summary-modal,
      .result-modal {
        padding: 20px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonRadioGroup,
    IonRadio,
    IonModal
  ]
})
export class ReservationPaymentPage implements OnInit {
  cityId?: number;
  roomId?: string;
  floor?: string;

  showSummaryModal = false;
  showSuccessModal = false;
  showErrorModal = false;

  paymentData: PaymentData = {
    amount: 10000,
    paymentMethod: 'orange',
    phoneNumber: '',
    responsibleName: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    addIcons({
      chevronBackOutline,
      warningOutline,
      informationCircleOutline,
      closeOutline,
      checkmarkCircleOutline
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cityId = params['cityId'];
      this.roomId = params['roomId'];
      this.floor = params['floor'];
    });
  }

  isFormValid(): boolean {
    return !!(
      this.paymentData.phoneNumber.trim().length >= 9 &&
      this.paymentData.responsibleName.trim().length >= 2 &&
      this.paymentData.paymentMethod
    );
  }

  getPaymentMethodName(): string {
    return this.paymentData.paymentMethod === 'orange' ? 'Orange Money' : 'MTN Mobile Money';
  }

  formatPhoneNumber(): string {
    const phone = this.paymentData.phoneNumber;
    if (phone.length === 9) {
      return `${phone.slice(0, 1)} ${phone.slice(1, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 7)} ${phone.slice(7, 9)}`;
    }
    return phone;
  }

  showSummary() {
    if (!this.isFormValid()) {
      this.showToast('Veuillez remplir tous les champs');
      return;
    }
    this.showSummaryModal = true;
  }

  closeSummary() {
    this.showSummaryModal = false;
  }

  async processPayment() {
    this.closeSummary();

    const loading = await this.loadingController.create({
      message: 'Traitement du paiement...',
      duration: 3000
    });
    await loading.present();

    // Simulation du paiement
    setTimeout(() => {
      loading.dismiss();
      
      // Simuler succès/échec (80% de succès)
      const success = Math.random() > 0.2;
      
      if (success) {
        this.saveReservation();
        this.showSuccessModal = true;
      } else {
        this.showErrorModal = true;
      }
    }, 3000);
  }

  private saveReservation() {
    const reservation = {
      id: Date.now(),
      cityName: 'Réservation cité Bevina',
      date: new Date().toLocaleDateString('fr-FR'),
      roomId: this.roomId,
      floor: this.floor,
      amount: this.paymentData.amount,
      paymentMethod: this.getPaymentMethodName(),
      responsibleName: this.paymentData.responsibleName,
      phoneNumber: this.paymentData.phoneNumber,
      status: 'reservee',
      timestamp: new Date().toISOString()
    };

    // Sauvegarder dans le localStorage
    const existingReservations = JSON.parse(localStorage.getItem('userReservations') || '[]');
    existingReservations.push(reservation);
    localStorage.setItem('userReservations', JSON.stringify(existingReservations));

    // Nettoyer la réservation en attente
    localStorage.removeItem('pendingReservation');
  }

  closeSuccess() {
    this.showSuccessModal = false;
  }

  closeError() {
    this.showErrorModal = false;
  }

  retryPayment() {
    this.closeError();
    this.showSummary();
  }

  goToReservations() {
    this.closeSuccess();
    this.router.navigate(['/reservations']);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'warning'
    });
    await toast.present();
  }
}