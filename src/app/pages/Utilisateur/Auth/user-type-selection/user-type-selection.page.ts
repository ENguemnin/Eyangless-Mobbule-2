import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-user-type-selection',
  template: `
    <ion-content class="selection-content">
      <div class="selection-container">
        <!-- Header -->
        <div class="header">
          <button class="back-button" (click)="goBack()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>
          <div class="logo-container">
            <img style="width: 100px" src="/assets/logo EyangLess.png" alt="">
          </div>
          <h2 class="page-title">Inscrivez-vous</h2>
        </div>

        <!-- Progress indicator -->
        <div class="progress-container">
          <div class="progress-dots">
            <div class="dot"></div>
            <div class="dot active"></div>
            <div class="dot"></div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="main-content">
          <h3 class="selection-title">Vous êtes...</h3>

          <!-- Options de sélection -->
          <div class="user-options">
            <div
              class="user-option"
              [class.selected]="selectedUserType === 'bailleur'"
              (click)="selectUserType('bailleur')"
            >
              <div class="user-icon">
                <div class="avatar bailleur-avatar">
                  <div class="face">
                    <div class="hair"></div>
                    <div class="eyes">
                      <div class="eye"></div>
                      <div class="eye"></div>
                    </div>
                    <div class="nose"></div>
                    <div class="mouth"></div>
                    <div class="beard"></div>
                  </div>
                </div>
              </div>
              <span class="user-label">Bailleur</span>
            </div>

            <div
              class="user-option"
              [class.selected]="selectedUserType === 'locataire'"
              (click)="selectUserType('locataire')"
            >
              <div class="user-icon">
                <div class="avatar locataire-avatar">
                  <div class="face">
                    <div class="hair-short"></div>
                    <div class="eyes">
                      <div class="eye"></div>
                      <div class="eye"></div>
                    </div>
                    <div class="nose"></div>
                    <div class="mouth"></div>
                  </div>
                </div>
              </div>
              <span class="user-label">Locataire</span>
            </div>
          </div>

          <!-- Bouton Suivant -->
          <button
            class="continue-button"
            (click)="continue()"
            [disabled]="!selectedUserType"
          >
            Suivant
          </button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .selection-content {
        --background: #ffffff;
      }

      .selection-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      /* Header */
      .header {
        text-align: center;
        padding: 60px 20px 30px;
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
;
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
        margin-bottom: 20px;
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
        color:#10b981;
        margin: 0;
      }

      /* Progress indicator */
      .progress-container {
        padding: 20px;
        display: flex;
        justify-content: center;
        background: #ffffff;
      }

      .progress-dots {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #e5e7eb;
        transition: all 0.3s ease;
      }

      .dot.active {
        background-color: #10b981;
        width: 24px;
        border-radius: 12px;
      }

      

      /* Contenu principal */
      .main-content {
        flex: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .selection-title {
        font-size: 20px;
        font-weight: 600;
        color: #374151;
        margin: 0 0 40px 0;
        text-align: center;
      }

      /* Options utilisateur */
      .user-options {
        display: flex;
        gap: 20px;
        margin-bottom: 60px;
        width: 100%;
        max-width: 400px;
      }

      .user-option {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 16px;
        background-color: #ffffff;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .user-option:hover {
        border-color: #d1d5db;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .user-option.selected {
        border-color: #10b981;
        background-color: #f0fdf4;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
      }

      .user-icon {
        margin-bottom: 16px;
      }

      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        position: relative;
        overflow: hidden;
      }

      .bailleur-avatar {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      }

      .locataire-avatar {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      }

      .face {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .hair {
        position: absolute;
        top: 8px;
        left: 12px;
        right: 12px;
        height: 20px;
        background: #4a5568;
        border-radius: 20px 20px 8px 8px;
      }

      .hair-short {
        position: absolute;
        top: 10px;
        left: 16px;
        right: 16px;
        height: 16px;
        background: #2d3748;
        border-radius: 16px 16px 6px 6px;
      }

      .eyes {
        position: absolute;
        top: 22px;
        left: 18px;
        right: 18px;
        display: flex;
        justify-content: space-between;
      }

      .eye {
        width: 6px;
        height: 6px;
        background: #1a202c;
        border-radius: 50%;
      }

      .nose {
        position: absolute;
        top: 32px;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 3px;
        background: #4a5568;
        border-radius: 1px;
      }

      .mouth {
        position: absolute;
        top: 38px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 2px;
        background: #4a5568;
        border-radius: 1px;
      }

      .beard {
        position: absolute;
        bottom: 8px;
        left: 20px;
        right: 20px;
        height: 12px;
        background: #2d3748;
        border-radius: 0 0 12px 12px;
      }

      .user-label {
        font-size: 16px;
        font-weight: 600;
        color: #374151;
        text-align: center;
      }

      /* Bouton suivant */
      .continue-button {
        width: 100%;
        max-width: 400px;
        height: 52px;
        background: linear-gradient(135deg, #1dd1a1 0%, #10b981 100%);
        border: none;
        border-radius: 12px;
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: auto;
        margin-bottom: 20px;
      }

      .continue-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      .continue-button:disabled {
        background: #d1d5db;
        color: #9ca3af;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .continue-button:active:not(:disabled) {
        transform: translateY(0);
      }
    `,
  ],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton],
})
export class UserTypeSelectionPage implements OnInit {
  selectedUserType: string = '';

  constructor(private router: Router, private location: Location) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit() {
    // Initialisation du composant
  }

  goBack() {
    this.location.back();
  }

  selectUserType(type: string) {
    this.selectedUserType = type;
  }

  continue() {
    if (this.selectedUserType) {
      console.log("Type d'utilisateur sélectionné:", this.selectedUserType);

      // Navigation vers la page de vérification du téléphone
      this.router.navigate(['/phone-verification']);
    }
  }
}
