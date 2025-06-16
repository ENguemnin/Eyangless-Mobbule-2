import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-code-verification',
  template: `
    <ion-content class="code-content">
      <div class="code-container">
        <!-- Header -->
        <div class="header">
          <button class="back-button" (click)="goBack()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>
          <div class="logo-container">
            <h1 class="brand-name">EyangLess</h1>
          </div>
          <h2 class="page-title">Code de vérification</h2>
        </div>

        <!-- Contenu principal -->
        <div class="main-content">
          <p class="instruction-text">
            Veuillez saisir le code de vérification que vous avez reçu sur votre
            numéro de téléphone.
          </p>

          <!-- Champs de code -->
          <div class="code-inputs">
            <input
              #input0
              type="text"
              maxlength="1"
              class="code-input"
              [class.filled]="verificationCode[0]"
              (input)="onCodeInput($event, 0)"
              (keydown)="onKeyDown($event, 0)"
              (paste)="onPaste($event)"
            />
            <input
              #input1
              type="text"
              maxlength="1"
              class="code-input"
              [class.filled]="verificationCode[1]"
              (input)="onCodeInput($event, 1)"
              (keydown)="onKeyDown($event, 1)"
            />
            <input
              #input2
              type="text"
              maxlength="1"
              class="code-input"
              [class.filled]="verificationCode[2]"
              (input)="onCodeInput($event, 2)"
              (keydown)="onKeyDown($event, 2)"
            />
            <input
              #input3
              type="text"
              maxlength="1"
              class="code-input"
              [class.filled]="verificationCode[3]"
              (input)="onCodeInput($event, 3)"
              (keydown)="onKeyDown($event, 3)"
            />
            <input
              #input4
              type="text"
              maxlength="1"
              class="code-input"
              [class.filled]="verificationCode[4]"
              (input)="onCodeInput($event, 4)"
              (keydown)="onKeyDown($event, 4)"
            />
            <input
              #input5
              type="text"
              maxlength="1"
              class="code-input"
              [class.filled]="verificationCode[5]"
              (input)="onCodeInput($event, 5)"
              (keydown)="onKeyDown($event, 5)"
            />
          </div>

          <!-- Timer et bouton renvoyer -->
          <div class="timer-section">
            <p class="timer-text">
              Temps restant :
              <span class="timer">{{ formatTime(timeRemaining) }}</span>
            </p>
            <p class="resend-text">
              Vous n'avez pas reçu de code ?
              <button
                class="resend-button"
                (click)="resendCode()"
                [disabled]="timeRemaining > 0"
              >
                Renvoyer
              </button>
            </p>
          </div>

          <!-- Bouton Vérifier -->
          <button
            class="verify-button"
            (click)="verifyCode()"
            [disabled]="verificationCode.length !== 6"
          >
            Vérifier
          </button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .code-content {
        --background: #ffffff;
      }

      .code-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      /* Header */
      .header {
        text-align: center;
        padding: 60px 20px 40px;
        background: #fff;
        position: relative;
        box-shadow: none;
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
        background-color: rgba(16, 185, 129, 0.08);
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
        margin: 0;
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

      /* Champs de code */
      .code-inputs {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-bottom: 40px;
      }

      .code-input {
        width: 48px;
        height: 56px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        text-align: center;
        font-size: 24px;
        font-weight: 600;
        color: #374151;
        background-color: #ffffff;
        transition: all 0.3s ease;
      }

      .code-input:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      }

      .code-input.filled {
        border-color: #10b981;
        background-color: #f0fdf4;
      }

      /* Section timer */
      .timer-section {
        text-align: center;
        margin-bottom: 40px;
      }

      .timer-text {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 12px;
      }

      .timer {
        color: #10b981;
        font-weight: 600;
      }

      .resend-text {
        font-size: 14px;
        color: #6b7280;
        margin: 0;
      }

      .resend-button {
        background: none;
        border: none;
        color: #10b981;
        font-weight: 600;
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
        margin-left: 4px;
        transition: opacity 0.3s ease;
      }

      .resend-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        text-decoration: none;
      }

      .resend-button:hover:not(:disabled) {
        opacity: 0.8;
      }

      /* Bouton vérifier */
      .verify-button {
        width: 100%;
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

      .verify-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      .verify-button:disabled {
        background: #d1d5db;
        color: #9ca3af;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .verify-button:active:not(:disabled) {
        transform: translateY(0);
      }
    `,
  ],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton],
})
export class CodeVerificationPage implements OnInit, OnDestroy {
  @ViewChildren('input0,input1,input2,input3,input4,input5')
  inputs!: QueryList<ElementRef>;

  verificationCode: string[] = ['', '', '', '', '', ''];
  timeRemaining: number = 45; // 45 secondes
  private timer: any;

  constructor(private router: Router, private location: Location) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  goBack() {
    this.location.back();
  }

  onCodeInput(event: any, index: number) {
    const value = event.target.value;

    if (value.match(/[0-9]/)) {
      this.verificationCode[index] = value;

      // Passer au champ suivant
      if (index < 5) {
        const nextInput = this.inputs.toArray()[index + 1];
        if (nextInput) {
          nextInput.nativeElement.focus();
        }
      }
    } else {
      event.target.value = '';
      this.verificationCode[index] = '';
    }
  }

  onKeyDown(event: any, index: number) {
    // Gérer la touche Backspace
    if (
      event.key === 'Backspace' &&
      !this.verificationCode[index] &&
      index > 0
    ) {
      const prevInput = this.inputs.toArray()[index - 1];
      if (prevInput) {
        this.verificationCode[index - 1] = '';
        prevInput.nativeElement.value = '';
        prevInput.nativeElement.focus();
      }
    }

    // Ne permettre que les chiffres
    if (
      !/[0-9]/.test(event.key) &&
      !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(
        event.key
      )
    ) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text');
    if (paste && paste.match(/^\d{6}$/)) {
      for (let i = 0; i < 6; i++) {
        this.verificationCode[i] = paste[i];
        const input = this.inputs.toArray()[i];
        if (input) {
          input.nativeElement.value = paste[i];
        }
      }
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  resendCode() {
    if (this.timeRemaining === 0) {
      // Logique pour renvoyer le code
      console.log('Renvoi du code...');
      this.timeRemaining = 45;
      this.startTimer();

      // Reset du code
      this.verificationCode = ['', '', '', '', '', ''];
      this.inputs.forEach((input) => {
        input.nativeElement.value = '';
      });

      // Focus sur le premier champ
      if (this.inputs.first) {
        this.inputs.first.nativeElement.focus();
      }
    }
  }

  verifyCode() {
    const code = this.verificationCode.join('');
    if (code.length === 6) {
      // Logique de vérification du code
      console.log('Code à vérifier:', code);

      // Simuler une vérification réussie
      // En cas de succès, naviguer vers la page de sélection du type d'utilisateur
      this.router.navigate(['/login']);
    }
  }
}
