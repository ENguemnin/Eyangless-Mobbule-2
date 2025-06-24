import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, NavController, ToastController, IonButtons, IonButton, IonIcon, IonLabel } from '@ionic/angular/standalone';

interface Supplement {
  id: string;
  label: string;
  value: boolean;
}

@Component({
  selector: 'app-update-supplements',
  templateUrl: './update-supplements.page.html',
  styleUrls: ['./update-supplements.page.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UpdateSupplementsPage implements OnInit {
// Suppléments par défaut (communs)
  defaultSupplements: Supplement[] = [
    { id: '1', label: 'Restaurant', value: false },
    { id: '2', label: 'Salle de jeux', value: false },
    { id: '3', label: 'Salle des fêtes', value: false },
    { id: '4', label: 'Pressing', value: false },
    { id: '5', label: 'Boutique', value: false },
    { id: '6', label: 'Piscine', value: false }
  ];

  // Suppléments personnalisés ajoutés par l'utilisateur
  customSupplements: Supplement[] = [];

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    // Charger les données sauvegardées si nécessaire
    this.loadSupplements();
  }

  /**
   * Retour à la page précédente
   */
  goBack(): void {
    this.navCtrl.back();
  }

  /**
   * Sauvegarder les suppléments sélectionnés
   */
  async saveSupplements(): Promise<void> {
    try {
      // Récupérer tous les suppléments sélectionnés
      const selectedSupplements = [
        ...this.defaultSupplements.filter(s => s.value),
        ...this.customSupplements.filter(s => s.value)
      ];

      // Ici vous pouvez sauvegarder dans votre service/API
      console.log('Suppléments sélectionnés:', selectedSupplements);

      // Afficher un message de confirmation
      await this.showToast('Suppléments sauvegardés avec succès', 'success');

      // Retourner à la page précédente
      this.goBack();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      await this.showToast('Erreur lors de la sauvegarde', 'danger');
    }
  }

  /**
   * Ajouter un supplément personnalisé
   */
  async addCustomSupplement(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nouveau supplément',
      message: 'Veuillez saisir le nom du nouveau supplément',
      inputs: [
        {
          name: 'label',
          type: 'text',
          placeholder: 'Ex: Spa, Coiffeur, etc.'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Ajouter',
          handler: (data:any) => {
            if (data.label && data.label.trim() !== '') {
              const newSupplement: Supplement = {
                id: Date.now().toString(),
                label: data.label.trim(),
                value: false
              };
              this.customSupplements.push(newSupplement);
              this.showToast('Supplément ajouté avec succès', 'success');
              return true;
            } else {
              this.showErrorAlert('Veuillez saisir un nom valide');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Supprimer un supplément personnalisé
   */
  async removeCustomSupplement(supplementId: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer ce supplément ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.customSupplements = this.customSupplements.filter(
              supplement => supplement.id !== supplementId
            );
            this.showToast('Supplément supprimé', 'success');
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Charger les suppléments sauvegardés
   */
  private loadSupplements(): void {
    // Ici vous pouvez charger les données depuis votre service/API
    // Exemple avec localStorage (si vous l'utilisez dans votre app)
    /*
    const savedSupplements = localStorage.getItem('supplements');
    if (savedSupplements) {
      const parsed = JSON.parse(savedSupplements);
      this.defaultSupplements = parsed.default || this.defaultSupplements;
      this.customSupplements = parsed.custom || [];
    }
    */
  }

  /**
   * Afficher un toast message
   */
  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  /**
   * Afficher une alerte d'erreur
   */
  private async showErrorAlert(message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Erreur',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Obtenir le nombre de suppléments sélectionnés
   */
  getSelectedCount(): number {
    const defaultSelected = this.defaultSupplements.filter(s => s.value).length;
    const customSelected = this.customSupplements.filter(s => s.value).length;
    return defaultSelected + customSelected;
  }

  /**
   * Vérifier si au moins un supplément est sélectionné
   */
  hasSelectedSupplements(): boolean {
    return this.getSelectedCount() > 0;
  }

}
