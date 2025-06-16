import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  template: `
    <ion-content class="login-content">
      <div class="login-container">
        <!-- Image de fond avec effet de dégradé -->
        <div class="background-image"></div>

        <!-- Logo Eyangless (image, centré, plus grand) -->
        <div class="logo-container">
          <img src="assets/logo EyangLess.png" alt="EyangLess" class="logo-img" />
        </div>

        <!-- Contenu principal -->
        <div class="content-overlay">
          <div class="header-text">
            <h1 class="main-title">Connectez-vous<br><span class="subtitle">à votre compte</span></h1>
            <p class="description">Veuillez entrer votre adresse email et votre mot de passe pour vous connecter.</p>
          </div>

          <form (ngSubmit)="login()" class="login-form">
            <div class="input-group">
              <label class="input-label">Adresse email</label>
              <div class="input-container">
                <ion-input
                  type="email"
                  placeholder="Entrer votre adresse email"
                  [(ngModel)]="email"
                  name="email"
                  class="custom-input"
                  required>
                </ion-input>
                <ion-icon name="mail-outline" class="input-icon"></ion-icon>
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Mot de passe</label>
              <div class="input-container">
                <ion-input
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Entrer votre mot de passe"
                  [(ngModel)]="password"
                  name="password"
                  class="custom-input"
                  required>
                </ion-input>
                <ion-icon
                  [name]="showPassword ? 'eye-off-outline' : 'eye-outline'"
                  class="input-icon password-toggle"
                  (click)="togglePassword()">
                </ion-icon>
              </div>
            </div>

            <div class="forgot-password">
              <a href="#" class="forgot-link" (click)="$event.preventDefault()">Mot de passe oublié ?</a>
            </div>

            <ion-button expand="block" class="login-button" type="submit">
              Connexion
            </ion-button>

            <div class="register-section">
              <span class="register-text">Vous n'avez pas de compte ? </span>
              <a href="#" class="register-link" (click)="navigateToRegister($event)">S'inscrire</a>
              <div class="divider">ou</div>
              <a href="#" class="guest-link" (click)="$event.preventDefault()">Continuer en tant qu'invité</a>
            </div>
          </form>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-content {
      --background: transparent;
      --padding-start: 0;
      --padding-end: 0;
      --padding-top: 0;
      --padding-bottom: 0;
    }

    .login-container {
      height: 100vh;
      position: relative;
      overflow: hidden;
    }

    .background-image {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    .background-image::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 180px;
      background: linear-gradient(
        to bottom,
        #fff 0%,
        rgba(255,255,255,0.95) 40%,
        rgba(255,255,255,0.7) 80%,
        rgba(255,255,255,0) 100%
      );
      z-index: 2;
      pointer-events: none;
    }

    .logo-container {
      position: absolute;
      top: 70px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      z-index: 3;
    }
    .logo-img {
      width: 160px;
      max-width: 80vw;
      margin: 0 auto;
      display: block;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.07));
    }

    .content-overlay {
      position: absolute;
      top: 160px;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 32px 20px 24px;
      z-index: 4;
      background: #fff;
      border-top-left-radius: 32px;
      border-top-right-radius: 32px;
      box-shadow: 0 -2px 16px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .header-text {
      text-align: center;
      margin-bottom: 28px;
    }
    .main-title {
      font-size: 28px;
      font-weight: 700;
      color: #111;
      margin: 0;
      line-height: 1.1;
      letter-spacing: -0.5px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .subtitle {
      font-size: 28px;
      font-weight: 700;
      color: #111;
      margin: 0;
      line-height: 1.1;
      letter-spacing: -0.5px;
      font-family: inherit;
      display: block;
    }
    .description {
      font-size: 15px;
      color: #666666;
      margin: 18px 0 0;
      line-height: 1.45;
      font-weight: 400;
      letter-spacing: -0.1px;
      font-family: inherit;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .input-label {
      font-size: 15px;
      font-weight: 500;
      color: #1a1a1a;
      letter-spacing: -0.1px;
      font-family: inherit;
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .custom-input {
      --background: #f8f9fa;
      --color: #1a1a1a;
      --placeholder-color: #999999;
      --padding-start: 16px;
      --padding-end: 48px;
      --border-radius: 12px;
      --min-height: 52px;
      border: 1px solid #e5e7eb;
      font-size: 16px;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
    }

    .custom-input:focus-within {
      border-color: #1DB584;
      --background: #ffffff;
    }

    .input-icon {
      position: absolute;
      right: 16px;
      color: #999999;
      font-size: 20px;
      z-index: 10;
    }

    .password-toggle {
      cursor: pointer;
      &:hover {
        color: #1DB584;
      }
    }

    .forgot-password {
      text-align: right;
      margin-top: -8px;
    }

    .forgot-link {
      color: #1DB584;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      &:hover {
        text-decoration: underline;
      }
    }

    .login-button {
      --background: #1DB584;
      --background-hover: #19a373;
      --background-activated: #17936a;
      --border-radius: 16px;
      --padding-top: 18px;
      --padding-bottom: 18px;
      --color: white;
      font-weight: 600;
      font-size: 17px;
      text-transform: none;
      letter-spacing: -0.2px;
      margin: 16px 0 0;
      height: 58px;
      --box-shadow: 0 4px 16px rgba(29, 181, 132, 0.25);
      font-family: inherit;
    }

    .register-section {
      text-align: center;
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .register-text {
      color: #666666;
      font-size: 14px;
      font-family: inherit;
    }

    .register-link {
      color: #1DB584;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      font-family: inherit;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    .divider {
      color: #999999;
      font-size: 14px;
      font-family: inherit;
    }

    .guest-link {
      color: #1DB584;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      font-family: inherit;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .logo-img {
        width: 110px;
      }
      .main-title, .subtitle {
        font-size: 22px;
      }
      .content-overlay {
        padding: 18px 8px 16px;
        top: 120px;
        border-top-left-radius: 18px;
        border-top-right-radius: 18px;
      }
      .logo-container {
        top: 38px;
      }
      .background-image::before {
        height: 120px;
      }
    }
  `],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router) {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    // Navigation vers la page home après connexion
    this.router.navigate(['/home']);
  }

  navigateToRegister(event: Event) {
    event.preventDefault();
    this.router.navigate(['/register']);
  }
}
