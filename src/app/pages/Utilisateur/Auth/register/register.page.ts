import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-register',
  template: `
    <ion-content class="register-content">
      <div class="register-container">
        <!-- Header avec logo et titre -->
        <div class="header">
          <div class="logo-container">
            <h1 class="brand-name">EyangLess</h1>
          </div>
          <h2 class="page-title">Inscrivez-vous</h2>
          <div class="progress-dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>

        <!-- Formulaire -->
        <form (ngSubmit)="register()" class="register-form">
          <!-- Nom -->
          <div class="input-group">
            <label>Nom</label>
            <div class="input-container">
              <input
                type="text"
                placeholder="Entrez votre nom"
                [(ngModel)]="lastName"
                name="lastName"
                class="custom-input"
              />
              <ion-icon name="person-outline" class="input-icon"></ion-icon>
            </div>
          </div>

          <!-- Prénom -->
          <div class="input-group">
            <label>Prénom</label>
            <div class="input-container">
              <input
                type="text"
                placeholder="Entrez votre prénom"
                [(ngModel)]="firstName"
                name="firstName"
                class="custom-input"
              />
              <ion-icon name="person-outline" class="input-icon"></ion-icon>
            </div>
          </div>

          <!-- Email -->
          <div class="input-group">
            <label>Adresse email</label>
            <div class="input-container">
              <input
                type="email"
                placeholder="Entrez votre adresse email"
                [(ngModel)]="email"
                name="email"
                class="custom-input"
              />
              <ion-icon name="mail-outline" class="input-icon"></ion-icon>
            </div>
          </div>

          <!-- Mot de passe -->
          <div class="input-group">
            <label>Mot de passe</label>
            <div class="input-container">
              <input
                [type]="showPassword ? 'text' : 'password'"
                placeholder="Entrez votre mot de passe"
                [(ngModel)]="password"
                name="password"
                class="custom-input"
              />
              <ion-icon
                [name]="showPassword ? 'eye-off-outline' : 'eye-outline'"
                class="input-icon clickable"
                (click)="togglePassword()"
              >
              </ion-icon>
            </div>
          </div>

          <!-- Confirmer mot de passe -->
          <div class="input-group">
            <label>Confirmer le mot de passe</label>
            <div class="input-container">
              <input
                [type]="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirmez le mot de passe"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                class="custom-input"
              />
              <ion-icon
                [name]="showConfirmPassword ? 'eye-off-outline' : 'eye-outline'"
                class="input-icon clickable"
                (click)="toggleConfirmPassword()"
              >
              </ion-icon>
            </div>
          </div>

          <!-- Bouton Suivant -->
          <button type="submit" class="next-button">Suivant</button>

          <!-- Lien de connexion -->
          <div class="login-link">
            <span>Vous n'avez un compte ? </span>
            <a (click)="navigateToLogin()" class="link-text">Connectez-vous</a>
          </div>
        </form>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .register-content {
        --background: #ffffff;
      }

      .register-container {
        padding: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      /* Header */
      .header {
        text-align: center;
        padding: 60px 20px 40px;
        background: #fff;
        border-radius: 0 0 0 0;
        box-shadow: none;
      }

      .logo-container {
        margin-bottom: 30px;
      }

      .brand-name {
        font-size: 32px;
        font-weight: 700;
        color: #10b981;
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
        background-color: rgba(16, 185, 129, 0.2);
        transition: all 0.3s ease;
      }

      .dot.active {
        background-color: #10b981;
        width: 24px;
        border-radius: 4px;
      }

      /* Formulaire */
      .register-form {
        flex: 1;
        padding: 30px 20px 20px;
        overflow-y: auto;
      }

      .input-group {
        margin-bottom: 24px;
      }

      .input-group label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 8px;
      }

      .input-container {
        position: relative;
      }

      .custom-input {
        width: 100%;
        padding: 16px 50px 16px 16px;
        border: 1.5px solid #e5e7eb;
        border-radius: 12px;
        font-size: 16px;
        background-color: #ffffff;
        transition: all 0.3s ease;
        box-sizing: border-box;
      }

      .custom-input:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      }

      .custom-input::placeholder {
        color: #9ca3af;
        font-size: 15px;
      }

      .input-icon {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
        font-size: 20px;
        z-index: 2;
      }

      .input-icon.clickable {
        cursor: pointer;
        color: #6b7280;
      }

      .input-icon.clickable:hover {
        color: #10b981;
      }

      /* Bouton Suivant */
      .next-button {
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
        margin-top: 20px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      .next-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
      }

      .next-button:active {
        transform: translateY(0);
      }

      /* Lien de connexion */
      .login-link {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
      }

      .login-link span {
        color: #6b7280;
        font-size: 14px;
      }

      .link-text {
        color: #10b981;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        font-size: 14px;
      }

      .link-text:hover {
        text-decoration: underline;
      }

      /* Responsive */
      @media (max-width: 375px) {
        .header {
          padding: 50px 16px 30px;
        }

        .register-form {
          padding: 24px 16px 16px;
        }

        .brand-name {
          font-size: 28px;
        }

        .page-title {
          font-size: 22px;
        }
      }

      /* iPhone X et plus grands */
      @media (min-height: 812px) {
        .header {
          padding-top: 80px;
        }
      }
    `,
  ],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
  ],
})
export class RegisterPage {
  lastName: string = '';
  firstName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router) {
    addIcons({
      personOutline,
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
    });
  }

  register() {
    // Validation basique
    if (
      !this.lastName ||
      !this.firstName ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      console.log('Veuillez remplir tous les champs');
      return;
    }

    if (this.password !== this.confirmPassword) {
      console.log('Les mots de passe ne correspondent pas');
      return;
    }

    // Logique d'inscription ici
    console.log('Inscription réussie');

    // Navigation vers la page de vérification du numéro de téléphone
    this.router.navigate(['/user-type-selection']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
