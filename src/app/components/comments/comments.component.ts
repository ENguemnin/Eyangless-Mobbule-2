import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonTextarea,
  IonList,
  IonAvatar,
  IonButtons,
  IonModal,
  IonCheckbox,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  starOutline,
  star,
  sendOutline,
  personOutline,
  chevronBackOutline
} from 'ionicons/icons';

interface Comment {
  id: number;
  author: string;
  text: string;
  rating: number;
  date: string;
  timestamp: Date;
  anonymous?: boolean;
}

@Component({
  selector: 'app-comments',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" (click)="closeModal()">
            <ion-icon name="chevron-back-outline" color="primary"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Commentaires</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="comments-content">
      <!-- Section d'ajout de note -->
      <div class="add-note-section">
        <ion-button
          expand="block"
          color="primary"
          class="add-note-btn"
          (click)="openRatingModal()"
        >
          <ion-icon name="star-outline" slot="start"></ion-icon>
          Laisser une note
        </ion-button>
      </div>

      <!-- Liste des commentaires -->
      <div class="comments-list">
        <div class="empty-state" *ngIf="comments.length === 0">
          <ion-icon name="star-outline" class="empty-icon"></ion-icon>
          <h3>Aucun commentaire</h3>
          <p>Soyez le premier à laisser un avis !</p>
        </div>

        <div class="comment-item" *ngFor="let comment of sortedComments; trackBy: trackByCommentId">
          <div class="comment-header">
            <ion-avatar class="comment-avatar">
              <div class="avatar-placeholder" [class.anonymous]="comment.anonymous">
                <ion-icon name="person-outline"></ion-icon>
              </div>
            </ion-avatar>
            <div class="comment-meta">
              <h4 class="comment-author">{{ comment.anonymous ? 'Anonyme' : comment.author }}</h4>
              <div class="comment-rating">
                <ion-icon
                  *ngFor="let i of [1, 2, 3, 4, 5]"
                  [name]="comment.rating >= i ? 'star' : 'star-outline'"
                  [class.filled]="comment.rating >= i"
                ></ion-icon>
                <span class="rating-text">{{ comment.rating }}/5</span>
              </div>
            </div>
            <div class="comment-date-badge">
              <span class="comment-date">{{ formatDate(comment.timestamp) }}</span>
            </div>
          </div>
          <p class="comment-text">{{ comment.text }}</p>
        </div>
      </div>

      <!-- Modal étape 1 : Choix de la note -->
      <ion-modal [isOpen]="showRatingModal" class="rating-modal" [backdropDismiss]="false">
        <ng-template>
          <div class="rating-modal-content">
            <div class="modal-header">
              <h3>Laisser une note</h3>
              <ion-button fill="clear" size="small" class="close-btn" (click)="closeRatingModal()">
                <ion-icon name="close-outline"></ion-icon>
              </ion-button>
            </div>

            <div class="rating-section">
              <div class="stars-row">
                <ion-icon
                  *ngFor="let i of [1,2,3,4,5]"
                  [name]="tempRating >= i ? 'star' : 'star-outline'"
                  [class.filled]="tempRating >= i"
                  [class.hover]="hoveredStar >= i"
                  (click)="setTempRating(i)"
                  (mouseenter)="hoveredStar = i"
                  (mouseleave)="hoveredStar = 0"
                  class="rating-star"
                ></ion-icon>
              </div>
              <div class="rating-label-modal">
                {{ getRatingLabel() }}
              </div>
            </div>

            <ion-button
              expand="block"
              color="primary"
              class="modal-send-btn"
              [disabled]="tempRating === 0"
              (click)="confirmRating()"
            >
              <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
              Continuer
            </ion-button>
          </div>
        </ng-template>
      </ion-modal>

      <!-- Modal étape 2 : Saisie du commentaire -->
      <ion-modal [isOpen]="showCommentModal" class="comment-modal" [backdropDismiss]="false">
        <ng-template>
          <div class="comment-modal-content">
            <div class="modal-header">
              <h3>Votre commentaire</h3>
              <ion-button fill="clear" size="small" class="close-btn" (click)="closeCommentModal()">
                <ion-icon name="close-outline"></ion-icon>
              </ion-button>
            </div>

            <div class="rating-display">
              <div class="stars-row">
                <ion-icon
                  *ngFor="let i of [1,2,3,4,5]"
                  [name]="userRating >= i ? 'star' : 'star-outline'"
                  [class.filled]="userRating >= i"
                  class="rating-star readonly"
                ></ion-icon>
              </div>
              <span class="rating-confirmation">{{ userRating }}/5 étoiles</span>
            </div>

            <div class="comment-input-wrapper">
              <ion-item class="comment-input">
                <ion-textarea
                  [(ngModel)]="newCommentText"
                  placeholder="Partagez votre expérience..."
                  rows="4"
                  autoGrow="true"
                  maxlength="500"
                  #commentTextarea
                ></ion-textarea>
              </ion-item>
              <div class="character-count">
                {{ newCommentText.length }}/500 caractères
              </div>
            </div>

            <div class="comment-options">
              <ion-checkbox
                [(ngModel)]="isAnonymous"
                class="anonymous-checkbox"
              ></ion-checkbox>
              <span class="anonymous-label">Publier en anonyme</span>
            </div>

            <ion-button
              expand="block"
              color="primary"
              class="modal-send-btn"
              [disabled]="!newCommentText.trim() || isSubmitting"
              (click)="submitComment()"
            >
              <ion-icon name="send-outline" slot="start" *ngIf="!isSubmitting"></ion-icon>
              <ion-icon name="hourglass-outline" slot="start" *ngIf="isSubmitting"></ion-icon>
              {{ isSubmitting ? 'Publication...' : 'Publier le commentaire' }}
            </ion-button>
          </div>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  styles: [`
    :host {
      --primary-color: #1dd1a1;
      --primary-light: #e8faf6;
      --text-primary: #374151;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      --background: #ffffff;
      --background-light: #f8f9fa;
      --border-color: #e5e7eb;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.08);
      --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.12);
      --border-radius: 16px;
      --border-radius-small: 12px;
    }

    /* Header Styles */
    ion-header ion-toolbar {
      --background: white;
      --color: var(--text-primary);
      border-bottom: 1px solid var(--border-color);
    }

    ion-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    ion-buttons ion-button {
      --color: var(--primary-color);
      --padding-start: 8px;
      --padding-end: 8px;
    }

    /* Content */
    .comments-content {
      --background: var(--background-light);
    }

    /* Add Note Section */
    .add-note-section {
      padding: 20px 16px;
      background: white;
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .add-note-btn {
      --border-radius: var(--border-radius-small);
      --background: var(--primary-color);
      --color: white;
      --padding-top: 16px;
      --padding-bottom: 16px;
      height: 52px;
      font-weight: 600;
      font-size: 16px;
      letter-spacing: 0.02em;
      box-shadow: var(--shadow-light);
      transition: all 0.3s ease;
    }

    .add-note-btn:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-medium);
    }

    /* Comments List */
    .comments-list {
      padding: 16px;
      min-height: 400px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    .comment-item {
      background: white;
      border-radius: var(--border-radius);
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: var(--shadow-light);
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .comment-item:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-medium);
    }

    .comment-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--primary-color);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .comment-item:hover::before {
      opacity: 1;
    }

    .comment-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      position: relative;
    }

    .comment-avatar {
      width: 44px;
      height: 44px;
      flex-shrink: 0;
    }

    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--primary-color), #16a085);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-light);
    }

    .avatar-placeholder.anonymous {
      background: linear-gradient(135deg, #6b7280, #4b5563);
    }

    .avatar-placeholder ion-icon {
      font-size: 20px;
      color: white;
    }

    .comment-meta {
      flex: 1;
      min-width: 0;
    }

    .comment-author {
      margin: 0 0 6px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .comment-rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .comment-rating ion-icon {
      font-size: 16px;
      color: #ddd;
    }

    .comment-rating ion-icon.filled {
      color: #ffc107;
    }

    .rating-text {
      margin-left: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .comment-date-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: var(--primary-light);
      padding: 4px 8px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .comment-date {
      font-size: 11px;
      font-weight: 500;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .comment-text {
      margin: 0;
      font-size: 15px;
      color: var(--text-primary);
      line-height: 1.6;
      letter-spacing: -0.01em;
    }

    /* Modal Styles */
    .rating-modal ion-modal,
    .comment-modal ion-modal {
      --width: 92vw;
      --max-width: 420px;
      --height: auto;
      --border-radius: 20px;
      --background: white;
      --box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }

    .rating-modal-content,
    .comment-modal-content {
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 300px;
    }

    .modal-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .close-btn {
      --padding-start: 8px;
      --padding-end: 8px;
      --color: var(--text-muted);
    }

    .close-btn ion-icon {
      font-size: 24px;
    }

    /* Rating Section */
    .rating-section {
      text-align: center;
      margin-bottom: 32px;
    }

    .stars-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      justify-content: center;
    }

    .rating-star {
      font-size: 36px;
      color: #e5e7eb;
      cursor: pointer;
      transition: all 0.2s ease;
      transform-origin: center;
    }

    .rating-star:hover {
      transform: scale(1.1);
    }

    .rating-star.filled {
      color: #ffc107;
      text-shadow: 0 2px 4px rgba(255, 193, 7, 0.3);
    }

    .rating-star.hover {
      color: #ffeb3b;
      transform: scale(1.05);
    }

    .rating-star.readonly {
      cursor: default;
      font-size: 24px;
    }

    .rating-star.readonly:hover {
      transform: none;
    }

    .rating-label-modal {
      font-size: 16px;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .rating-display {
      text-align: center;
      margin-bottom: 24px;
      padding: 16px;
      background: var(--primary-light);
      border-radius: var(--border-radius-small);
      border: 1px solid rgba(29, 209, 161, 0.2);
    }

    .rating-confirmation {
      display: block;
      margin-top: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-color);
    }

    /* Comment Input */
    .comment-input-wrapper {
      width: 100%;
      margin-bottom: 20px;
    }

    .comment-input {
      --background: var(--background-light);
      --border-radius: var(--border-radius-small);
      --border-color: var(--border-color);
      --border-width: 2px;
      --border-style: solid;
      --padding-start: 16px;
      --padding-end: 16px;
      --padding-top: 12px;
      --padding-bottom: 12px;
      margin: 0 0 8px 0;
      width: 100%;
      transition: all 0.3s ease;
    }

    .comment-input:focus-within {
      --border-color: var(--primary-color);
      --background: white;
    }

    .comment-input ion-textarea {
      --color: var(--text-primary);
      --placeholder-color: var(--text-muted);
      font-size: 15px;
      line-height: 1.5;
    }

    .character-count {
      text-align: right;
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .comment-options {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      width: 100%;
      padding: 12px 16px;
      background: var(--background-light);
      border-radius: var(--border-radius-small);
      border: 1px solid var(--border-color);
    }

    .anonymous-checkbox {
      --size: 18px;
      --checkmark-color: white;
      --background-checked: var(--primary-color);
      --border-color-checked: var(--primary-color);
      --border-radius: 4px;
    }

    .anonymous-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    /* Modal Buttons */
    .modal-send-btn {
      --border-radius: var(--border-radius-small);
      --background: var(--primary-color);
      --color: white;
      --padding-top: 16px;
      --padding-bottom: 16px;
      height: 52px;
      font-weight: 600;
      font-size: 16px;
      letter-spacing: 0.02em;
      box-shadow: var(--shadow-light);
      transition: all 0.3s ease;
      width: 100%;
    }

    .modal-send-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: var(--shadow-medium);
    }

    .modal-send-btn:disabled {
      --background: #d1d5db;
      --color: #9ca3af;
      cursor: not-allowed;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .add-note-section {
        padding: 16px 12px;
      }

      .comments-list {
        padding: 12px;
      }

      .comment-item {
        padding: 16px;
        margin-bottom: 12px;
      }

      .rating-modal-content,
      .comment-modal-content {
        padding: 24px 20px;
      }

      .rating-star {
        font-size: 32px;
      }
    }

    /* Animation */
    @keyframes slideInUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .comment-item {
      animation: slideInUp 0.4s ease-out;
    }

    /* Success Animation */
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .rating-star.filled {
      animation: pulse 0.3s ease-in-out;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonTextarea,
    IonList,
    IonAvatar,
    IonButtons,
    IonModal,
    IonCheckbox
  ]
})
export class CommentsComponent implements OnInit {
  @Input() cityId?: number;
  @Input() isOpen = false;

  comments: Comment[] = [
    {
      id: 1,
      author: 'Roy Melvin',
      text: 'Je ne sais même pas ce que je peux dire sur cette cité, parce que je ne l\'aime pas vraiment.',
      rating: 2,
      date: '02/05/2025',
      timestamp: new Date('2025-05-02T14:30:00'),
      anonymous: false
    },
    {
      id: 2,
      author: 'Anonyme',
      text: 'Anonymement, je laisse une bonne note à cette cité pour son libertinage absolu.',
      rating: 4,
      date: '01/05/2025',
      timestamp: new Date('2025-05-01T16:45:00'),
      anonymous: true
    },
    {
      id: 3,
      author: 'Steves DK',
      text: 'Entre temps moi je ne suis pas par rapport à cette cité, mais comme on m\'a forcé à venir parler ici, et qu\'on m\'a forcé à dire que c\'est une bonne cité, je dis donc que c\'est une très bonne cité.',
      rating: 4,
      date: '30/04/2025',
      timestamp: new Date('2025-04-30T10:15:00'),
      anonymous: false
    }
  ];

  showRatingModal = false;
  showCommentModal = false;
  tempRating = 0;
  userRating = 0;
  newCommentText = '';
  isAnonymous = false;
  hoveredStar = 0;
  isSubmitting = false;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({
      closeOutline,
      starOutline,
      star,
      sendOutline,
      personOutline,
      chevronBackOutline
    });
  }

  ngOnInit() {
    if (this.cityId) {
      this.loadComments();
    }
  }

  get sortedComments(): Comment[] {
    return [...this.comments].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  trackByCommentId(index: number, comment: Comment): number {
    return comment.id;
  }

  private loadComments() {
    // Simulation du chargement depuis l'API
    console.log(`Chargement des commentaires pour la cité ${this.cityId}`);
  }

  openRatingModal() {
    this.tempRating = 0;
    this.hoveredStar = 0;
    this.showRatingModal = true;
  }

  closeRatingModal() {
    this.showRatingModal = false;
    this.tempRating = 0;
    this.hoveredStar = 0;
  }

  setTempRating(rating: number) {
    this.tempRating = rating;
  }

  getRatingLabel(): string {
    if (this.tempRating === 0) return 'Sélectionnez une note';

    const labels = [
      '', 'Très décevant', 'Décevant', 'Correct', 'Bien', 'Excellent'
    ];

    return `${this.tempRating} étoile${this.tempRating > 1 ? 's' : ''} - ${labels[this.tempRating]}`;
  }

  confirmRating() {
    if (this.tempRating > 0) {
      this.userRating = this.tempRating;
      this.showRatingModal = false;

      // Transition fluide vers la modal de commentaire
      setTimeout(() => {
        this.showCommentModal = true;
      }, 200);
    }
  }

  closeCommentModal() {
    this.showCommentModal = false;
    this.resetForm();
  }

  private resetForm() {
    this.userRating = 0;
    this.newCommentText = '';
    this.isAnonymous = false;
    this.isSubmitting = false;
  }

  async submitComment() {
    if (!this.newCommentText.trim() || this.userRating === 0 || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    try {
      // Simulation d'un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));

      const now = new Date();
      const newComment: Comment = {
        id: Date.now(),
        author: this.isAnonymous ? 'Anonyme' : 'Utilisateur',
        text: this.newCommentText.trim(),
        rating: this.userRating,
        date: this.formatDateString(now),
        timestamp: now,
        anonymous: this.isAnonymous
      };

      // Ajouter le nouveau commentaire en haut de la liste
      this.comments.unshift(newComment);

      // Sauvegarder en base (simulation)
      await this.saveComment(newComment);

      // Fermer la modal
      this.showCommentModal = false;

      // Afficher le message de succès
      await this.showSuccessToast();

      // Réinitialiser le formulaire
      this.resetForm();

      // Retour à la page précédente après un court délai
      setTimeout(() => {
        this.closeModal();
      }, 1500);

    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      await this.showErrorToast();
    } finally {
      this.isSubmitting = false;
    }
  }

  private async saveComment(comment: Comment): Promise<void> {
    try {
      // Simulation de l'appel API
      console.log('Sauvegarde du commentaire:', comment);

      // Ici vous feriez l'appel réel à votre API
      // await this.commentsService.addComment(this.cityId, comment);

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  private formatDateString(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  closeModal() {
    // Dans un contexte réel, vous utiliseriez un service de navigation
    // ou un EventEmitter pour communiquer avec le composant parent
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  }

  private async showSuccessToast() {
  const toast = await this.toastController.create({
    message: '🎉 Merci pour votre avis ! Votre commentaire a été publié avec succès.',
    duration: 3000,
    position: 'top',
    color: 'success',
    cssClass: 'success-toast',
    buttons: [
      {
        text: 'Voir',
        role: 'info',
        handler: () => {
          // Faire défiler vers le nouveau commentaire
          setTimeout(() => {
            const firstComment = document.querySelector('.comment-item');
            if (firstComment) {
              firstComment.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
              // Effet de surbrillance temporaire
              firstComment.classList.add('highlighted');
              setTimeout(() => {
                firstComment.classList.remove('highlighted');
              }, 2000);
            }
          }, 500);
          return true;
        }
      },
      {
        text: 'Fermer',
        role: 'cancel',
        handler: () => {
          return true;
        }
      }
    ],
    // Animation personnalisée
    animated: true,
    keyboardClose: true,
    swipeGesture: 'vertical'
  });

  await toast.present();

  // Vibration légère pour le feedback haptique (si disponible)
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 30, 50]);
  }

  return toast;
}

private async showErrorToast() {
  const toast = await this.toastController.create({
    message: '❌ Oups ! Une erreur est survenue lors de la publication de votre commentaire.',
    duration: 4000,
    position: 'top',
    color: 'danger',
    cssClass: 'error-toast',
    buttons: [
      {
        text: 'Réessayer',
        role: 'info',
        handler: () => {
          // Relancer la soumission
          this.submitComment();
          return true;
        }
      },
      {
        text: 'Fermer',
        role: 'cancel',
        handler: () => {
          return true;
        }
      }
    ],
    animated: true,
    keyboardClose: true,
    swipeGesture: 'vertical'
  });

  await toast.present();
  return toast;
}

// Méthode pour afficher un toast de confirmation avant soumission
private async showConfirmationAlert(): Promise<boolean> {
  return new Promise(async (resolve) => {
    const alert = await this.alertController.create({
      header: '📝 Confirmation',
      subHeader: 'Publier votre avis ?',
      message: `Vous êtes sur le point de publier un avis avec ${this.userRating} étoile${this.userRating > 1 ? 's' : ''}.`,
      cssClass: 'confirmation-alert',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            resolve(false);
          }
        },
        {
          text: 'Publier',
          cssClass: 'alert-button-confirm',
          handler: () => {
            resolve(true);
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  });
}
}
