import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-landing',
  template: `
    <ion-content class="landing-content">
      <div class="landing-container">
        <!-- Image de fond avec l'effet de brouillard -->
        <div class="background-image"></div>

        <!-- Logo Eyangless -->
        <div class="logo-container">
          <img src="assets/logo EyangLess.png" alt="" />
        </div>

        <!-- Contenu principal -->
        <div class="content-overlay">
          <div class="text-content">
            <h1 class="main-title">Trouves ta chambre</h1>
            <h1 class="main-title second-line">sans te déplacer.</h1>
            <p class="subtitle">
              Plus besoin de te déplacer pour visiter la prochaine<br />cité
              dans laquelle tu veux habiter.
            </p>
          </div>

          <ion-button
            expand="block"
            class="custom-button"
            (click)="navigateToLogin()"
          >
            Suivant
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .landing-content {
        --background: transparent;
        --padding-start: 0;
        --padding-end: 0;
        --padding-top: 0;
        --padding-bottom: 0;
      }

      .landing-container {
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

        /* Effet de dégradé exact comme la maquette */
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            transparent 0%,
            transparent 25%,
            rgba(255, 255, 255, 0.1) 40%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0.7) 60%,
            rgba(255, 255, 255, 0.85) 70%,
            rgba(255, 255, 255, 0.95) 80%,
            rgba(255, 255, 255, 1) 90%,
            rgba(255, 255, 255, 1) 100%
          );
        }
      }

      .logo-container {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
      }

      .logo-text {
        font-size: 46px;
        font-weight: 400;
        color: #1db584;
        margin: 0;
        text-align: center;
        letter-spacing: -0.5px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          Helvetica, Arial, sans-serif;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .content-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 48px 36px 64px; /* marges internes augmentées */
        z-index: 3;
        display: flex;
        flex-direction: column;
        gap: 40px;
      }

      .text-content {
        text-align: center;
      }

      .main-title {
        font-size: 32px;
        font-weight: 700;
        color: #1a1a1a;
        margin: 0;
        line-height: 1.1;
        letter-spacing: -0.5px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
      }

      .main-title.second-line {
        margin-top: 4px;
      }

      .subtitle {
        font-size: 16px;
        color: #666666;
        margin: 20px 0 0;
        line-height: 1.45;
        font-weight: 400;
        letter-spacing: -0.1px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
      }

      .custom-button {
        --background: #1db584;
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
        margin: 0;
        height: 58px;
        --box-shadow: 0 4px 16px rgba(29, 181, 132, 0.25);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
      }

      /* Styles pour iOS/mobile */
      @media (max-width: 768px) {
        .logo-text {
          font-size: 42px;
        }

        .main-title {
          font-size: 30px;
        }

        .subtitle {
          font-size: 15px;
        }

        .content-overlay {
          padding: 36px 18px 56px; /* marges internes augmentées sur mobile */
          gap: 36px;
        }

        .logo-container {
          top: 58%; /* Descend aussi sur mobile */
        }
        .logo-container img {
          width: 150px;
        }
      }
    `,
  ],
  standalone: true,
  imports: [IonContent, IonButton],
})
export class LandingPage {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
