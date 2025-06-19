import { Component, Input, OnInit } from '@angular/core';
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
      <!-- Liste des commentaires -->
      <div class="comments-list">
        <div class="comment-item" *ngFor="let comment of comments">
          <div class="comment-header">
            <ion-avatar class="comment-avatar">
              <div class="avatar-placeholder">
                <ion-icon name="person-outline"></ion-icon>
              </div>
            </ion-avatar>
            <div class="comment-meta">
              <h4 class="comment-author">~{{ comment.anonymous ? 'Anonyme' : comment.author }}</h4>
              <div class="comment-rating">
                <ion-icon
                  *ngFor="let i of [1, 2, 3, 4, 5]"
                  [name]="comment.rating >= i ? 'star' : 'star-outline'"
                  [class.filled]="comment.rating >= i"
                ></ion-icon>
              </div>
            </div>
          </div>

          <p class="comment-text">{{ comment.text }}</p>
          <span class="comment-date">Publié le {{ comment.date }}</span>
        </div>
      </div>

      <!-- Zone de saisie de commentaire -->
      <div class="comment-input-section">
        <div class="rating-input">
          <span class="rating-label">Votre note :</span>
          <div class="rating-stars">
            <ion-icon
              *ngFor="let i of [1, 2, 3, 4, 5]"
              [name]="userRating >= i ? 'star' : 'star-outline'"
              [class.filled]="userRating >= i"
              (click)="setRating(i)"
              class="rating-star"
            ></ion-icon>
          </div>
        </div>

        <div class="comment-input-container">
          <ion-item class="comment-input">
            <ion-textarea
              [(ngModel)]="newCommentText"
              placeholder="Saisissez votre commentaire"
              rows="3"
              autoGrow="true"
            ></ion-textarea>
          </ion-item>
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
          class="submit-button"
          (click)="submitComment()"
          [disabled]="!newCommentText.trim() || userRating === 0"
        >
          <ion-icon name="send-outline" slot="start"></ion-icon>
          Envoyer
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      --primary-color: #1dd1a1;
      --text-primary: #374151;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
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
    .comments-content {
      --background: #f8f9fa;
    }

    /* Liste des commentaires */
    .comments-list {
      padding: 16px;
    }

    .comment-item {
      background: white;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .comment-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }

    .comment-avatar {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
    }

    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-placeholder ion-icon {
      font-size: 20px;
      color: white;
    }

    .comment-meta {
      flex: 1;
    }

    .comment-author {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .comment-rating {
      display: flex;
      gap: 2px;
    }

    .comment-rating ion-icon {
      font-size: 14px;
      color: #ddd;
    }

    .comment-rating ion-icon.filled {
      color: #ffd700;
    }

    .comment-text {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: var(--text-primary);
      line-height: 1.5;
    }

    .comment-date {
      font-size: 12px;
      color: var(--text-muted);
    }

    /* Zone de saisie */
    .comment-input-section {
      background: white;
      padding: 20px 16px;
      border-top: 1px solid var(--border-color);
      position: sticky;
      bottom: 0;
    }

    .rating-input {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .rating-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .rating-stars {
      display: flex;
      gap: 4px;
    }

    .rating-star {
      font-size: 20px;
      color: #ddd;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .rating-star.filled {
      color: #ffd700;
    }

    .rating-star:hover {
      color: #ffd700;
    }

    .comment-input-container {
      margin-bottom: 16px;
    }

    .comment-input {
      --background: #f8f9fa;
      --border-radius: 12px;
      --border-color: var(--border-color);
      --border-width: 1px;
      --border-style: solid;
      --padding-start: 16px;
      --padding-end: 16px;
      --padding-top: 12px;
      --padding-bottom: 12px;
      margin: 0;
    }

    .comment-input ion-textarea {
      --color: var(--text-primary);
      --placeholder-color: var(--text-muted);
      font-size: 14px;
    }

    .comment-options {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .anonymous-checkbox {
      --size: 16px;
      --checkmark-color: white;
      --background-checked: var(--primary-color);
      --border-color-checked: var(--primary-color);
    }

    .anonymous-label {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .submit-button {
      --border-radius: 12px;
      --padding-top: 16px;
      --padding-bottom: 16px;
      height: 56px;
      font-weight: 600;
    }

    .submit-button:disabled {
      --background: #d1d5db;
      --color: #9ca3af;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .comments-list {
        padding: 12px;
      }

      .comment-item {
        padding: 12px;
        margin-bottom: 12px;
      }

      .comment-input-section {
        padding: 16px 12px;
      }
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
      rating: 4,
      date: '02/05/2025',
      anonymous: false
    },
    {
      id: 2,
      author: 'Anonyme',
      text: 'Anonymement, je laisse une bonne note à cette cité pour son libertinage absolu.',
      rating: 4,
      date: '01/05/2025',
      anonymous: true
    },
    {
      id: 3,
      author: 'Steves DK',
      text: 'Entre temps moi je ne suis pas par rapport à cette cité, mais comme on m\'a forcé à venir parler ici, et qu\'on m\'a forcé à dire que c\'est une bonne cité, je dis donc que c\'est une très bonne cité.',
      rating: 4,
      date: '30/04/2025',
      anonymous: false
    }
  ];

  newCommentText = '';
  userRating = 0;
  isAnonymous = false;

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
    // Charger les commentaires pour la cité spécifique
    if (this.cityId) {
      this.loadComments();
    }
  }

  private loadComments() {
    // Ici vous pourriez charger les commentaires depuis votre API
    // Pour l'exemple, on utilise des données statiques
  }

  setRating(rating: number) {
    this.userRating = rating;
  }

  async submitComment() {
    if (!this.newCommentText.trim() || this.userRating === 0) {
      await this.showToast('Veuillez saisir un commentaire et une note', 'warning');
      return;
    }

    const newComment: Comment = {
      id: Date.now(),
      author: this.isAnonymous ? 'Anonyme' : 'Utilisateur', // Remplacer par le nom réel de l'utilisateur
      text: this.newCommentText.trim(),
      rating: this.userRating,
      date: new Date().toLocaleDateString('fr-FR'),
      anonymous: this.isAnonymous
    };

    // Ajouter le commentaire en haut de la liste
    this.comments.unshift(newComment);

    // Réinitialiser le formulaire
    this.newCommentText = '';
    this.userRating = 0;
    this.isAnonymous = false;

    await this.showToast('Commentaire publié avec succès', 'success');

    // Ici vous pourriez envoyer le commentaire à votre API
    this.saveComment(newComment);
  }

  private async saveComment(comment: Comment) {
    try {
      // Simulation de l'envoi à l'API
      console.log('Sauvegarde du commentaire:', comment);

      // Ici vous feriez l'appel réel à votre API
      // await this.commentsService.addComment(this.cityId, comment);

    } catch (error) {
      console.error('Erreur lors de la sauvegarde du commentaire:', error);
      await this.showToast('Erreur lors de la publication du commentaire', 'danger');
    }
  }

  closeModal() {
    // Émettre un événement pour fermer le modal
    // Dans un contexte réel, vous utiliseriez @Output() et EventEmitter
    window.history.back();
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