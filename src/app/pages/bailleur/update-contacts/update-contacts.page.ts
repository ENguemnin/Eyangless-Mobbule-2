import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonModal, IonButtons, AlertController, ToastController, NavController } from '@ionic/angular/standalone';

interface Contact {
  id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

@Component({
  selector: 'app-update-contacts',
  templateUrl: './update-contacts.page.html',
  styleUrls: ['./update-contacts.page.scss'],
  standalone: true,
  imports: [IonButtons, IonModal, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UpdateContactsPage implements OnInit {
  // Liste des contacts
  contacts: Contact[] = [
    {
      id: '1',
      name: 'M. Anatole Guérin',
      email: 'anatole@gmail.com',
      phone: '+237 673 58 99 00'
    }
  ];

  // État du modal d'ajout
  isAddContactModalOpen = false;

  // Nouveau contact en cours de création
  newContact: Partial<Contact> = {
    name: '',
    role: '',
    email: '',
    phone: ''
  };

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    // Charger les contacts sauvegardés
    this.loadContacts();
  }

  /**
   * Retour à la page précédente
   */
  goBack(): void {
    this.navCtrl.back();
  }

  /**
   * Sauvegarder les contacts
   */
  async saveContacts(): Promise<void> {
    try {
      // Ici vous pouvez sauvegarder dans votre service/API
      console.log('Contacts à sauvegarder:', this.contacts);

      // Afficher un message de confirmation
      await this.showToast('Contacts sauvegardés avec succès', 'success');

      // Retourner à la page précédente
      this.goBack();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      await this.showToast('Erreur lors de la sauvegarde', 'danger');
    }
  }

  /**
   * Ouvrir le modal d'ajout de contact
   */
  openAddContactModal(): void {
    this.resetNewContact();
    this.isAddContactModalOpen = true;
  }

  /**
   * Fermer le modal d'ajout de contact
   */
  closeAddContactModal(): void {
    this.isAddContactModalOpen = false;
    this.resetNewContact();
  }

  /**
   * Réinitialiser le formulaire de nouveau contact
   */
  private resetNewContact(): void {
    this.newContact = {
      name: '',
      role: '',
      email: '',
      phone: ''
    };
  }

  /**
   * Ajouter un nouveau contact
   */
  async addContact(): Promise<void> {
    // Validation
    if (!this.newContact.name || this.newContact.name.trim() === '') {
      await this.showToast('Veuillez saisir le nom du contact', 'warning');
      return;
    }

    // Validation email si fourni
    if (this.newContact.email && !this.isValidEmail(this.newContact.email)) {
      await this.showToast('Veuillez saisir une adresse email valide', 'warning');
      return;
    }

    try {
      // Créer le nouveau contact
      const contact: Contact = {
        id: Date.now().toString(),
        name: this.newContact.name.trim(),
        role: this.newContact.role?.trim() || undefined,
        email: this.newContact.email?.trim() || undefined,
        phone: this.newContact.phone?.trim() || undefined
      };

      // Ajouter à la liste
      this.contacts.push(contact);

      // Fermer le modal
      this.closeAddContactModal();

      // Afficher un message de succès
      await this.showToast('Contact ajouté avec succès', 'success');

    } catch (error) {
      console.error('Erreur lors de l\'ajout du contact:', error);
      await this.showToast('Erreur lors de l\'ajout du contact', 'danger');
    }
  }

  /**
   * Supprimer un contact
   */
  async removeContact(contactId: string): Promise<void> {
    const contact = this.contacts.find(c => c.id === contactId);
    if (!contact) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer le contact "${contact.name}" ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.contacts = this.contacts.filter(c => c.id !== contactId);
            this.showToast('Contact supprimé', 'success');
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Charger les contacts sauvegardés
   */
  private loadContacts(): void {
    // Ici vous pouvez charger les données depuis votre service/API
    // Exemple avec localStorage (si vous l'utilisez dans votre app)
    /*
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      this.contacts = JSON.parse(savedContacts);
    }
    */
  }

  /**
   * Valider une adresse email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
   * Obtenir le nombre de contacts
   */
  getContactsCount(): number {
    return this.contacts.length;
  }

  /**
   * Vérifier si la liste est vide
   */
  hasContacts(): boolean {
    return this.contacts.length > 0;
  }

  /**
   * Obtenir les contacts avec email
   */
  getContactsWithEmail(): Contact[] {
    return this.contacts.filter(contact => contact.email);
  }

  /**
   * Obtenir les contacts avec téléphone
   */
  getContactsWithPhone(): Contact[] {
    return this.contacts.filter(contact => contact.phone);
  }

  /**
   * Formater le numéro de téléphone pour l'affichage
   */
  formatPhoneNumber(phone: string): string {
    // Vous pouvez ajouter une logique de formatage ici
    return phone;
  }

  /**
   * Lancer un appel téléphonique
   */
  callContact(phone: string): void {
    window.open(`tel:${phone}`, '_system');
  }

  /**
   * Envoyer un email
   */
  emailContact(email: string): void {
    window.open(`mailto:${email}`, '_system');
  }

}
