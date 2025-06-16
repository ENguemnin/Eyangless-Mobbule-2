import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-phone-verification',
  template: `
    <ion-content class="phone-content">
      <div class="phone-container">
        <!-- Header avec bouton retour -->
        <div class="header">
          <button class="back-button" (click)="goBack()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>
          <div class="logo-container">
          <img style="width: 100px" src="/assets/logo EyangLess.png" alt="">
          </div>
          <h2 class="page-title">Inscrivez-vous</h2>
          <div class="progress-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot active"></span>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="main-content">
          <p class="instruction-text">
            Veuillez entrer votre numéro de téléphone pour recevoir le code de
            vérification.
          </p>

          <form (ngSubmit)="sendVerificationCode()" class="phone-form">
            <!-- Champ numéro de téléphone -->
            <div class="phone-input-container">
              <div class="country-code">+237</div>
              <input
                type="tel"
                placeholder="Numéro de téléphone"
                [(ngModel)]="phoneNumber"
                name="phoneNumber"
                class="phone-input"
                maxlength="9"
              />
            </div>

            <!-- Bouton Terminé -->
            <button
              type="submit"
              class="done-button"
              [disabled]="!phoneNumber || phoneNumber.length < 9"
            >
              Terminé
            </button>
          </form>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .phone-content {
        --background: #ffffff;
      }

      .phone-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      /* Header */
      .header {
        text-align: center;
        padding: 60px 20px 40px;
        background: #ffffff;
        position: relative;
      }

      .back-button {
        position: absolute;
        left: 20px;
        top: 70px;
        background: none;
        border: none;
        color: #10b981;
        font-size: 24px;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease;
      }

      .back-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .logo-container {
        margin-bottom: 30px;
      }

      .brand-name {
        font-size: 32px;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
        letter-spacing: -0.5px;
      }

      .page-title {
        font-size: 24px;
        font-weight: 600;
        color: #10b981;
        margin: 0 0 20px 0;
      }

      .progress-dots {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 20px;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #e5e7eb;
        transition: all 0.3s ease;
      }

      .dot.active {
        background-color:#10b981;

        width: 24px;
        border-radius: 4px;
      }

      /* Contenu principal */
      .main-content {
        flex: 1;
        padding: 40px 20px 20px;
        display: flex;
        flex-direction: column;
      }

      .instruction-text {
        font-size: 16px;
        color: #374151;
        text-align: center;
        line-height: 1.5;
        margin-bottom: 40px;
      }

      .phone-form {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      /* Champ téléphone */
      .phone-input-container {
        display: flex;
        border: 1.5px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        background-color: #ffffff;
        transition: border-color 0.3s ease;
      }

      .phone-input-container:focus-within {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      }

      .country-code {
        padding: 16px;
        background-color: #f9fafb;
        border-right: 1px solid #e5e7eb;
        font-size: 16px;
        color: #374151;
        font-weight: 500;
        display: flex;
        align-items: center;
      }

      .phone-input {
        flex: 1;
        padding: 16px;
        border: none;
        outline: none;
        font-size: 16px;
        background-color: transparent;
      }

      .phone-input::placeholder {
        color: #9ca3af;
      }

      /* Bouton Terminé */
      .done-button {
        width: 100%;
        padding: 18px;
        background: linear-gradient(135deg, #1dd1a1 0%, #10b981 100%);
        border: none;
        border-radius: 12px;
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 40px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      .done-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
      }

      .done-button:disabled {
        background: #d1d5db;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .done-button:active:not(:disabled) {
        transform: translateY(0);
      }

      /* Responsive */
      @media (max-width: 375px) {
        .header {
          padding: 50px 16px 30px;
        }

        .main-content {
          padding: 30px 16px 16px;
        }

        .brand-name {
          font-size: 28px;
        }

        .page-title {
          font-size: 22px;
        }

        .back-button {
          left: 16px;
          top: 60px;
        }
      }

      /* iPhone X et plus grands */
      @media (min-height: 812px) {
        .header {
          padding-top: 80px;
        }

        .back-button {
          top: 90px;
        }
      }
    `,
  ],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButton,
  ],
})
export class PhoneVerificationPage {
  phoneNumber: string = '';

  constructor(private router: Router, private location: Location) {
    addIcons({ chevronBackOutline });
  }

  sendVerificationCode() {
    if (this.phoneNumber && this.phoneNumber.length >= 9) {
      console.log('Code de vérification envoyé au:', '+237' + this.phoneNumber);

      // Navigation vers la page de vérification du code
      this.router.navigate(['/code-verification']);
    }
  }

  goBack() {
    this.location.back();
  }
}
