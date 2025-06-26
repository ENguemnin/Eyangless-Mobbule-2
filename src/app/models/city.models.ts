// src/app/models/city.models.ts

export interface Localisation {
  id?: string;
  adresse?: string;
  ville?: string;
  region?: string;
  pays?: string;
  codePostal?: string;
  latitude?: number;
  longitude?: number;
}

export interface Contact {
  id?: string;
  type?: string; // EMAIL, PHONE, WHATSAPP, etc.
  valeur?: string;
  principal?: boolean;
}

export interface Caracteristique {
  id?: string;
  nom?: string;
  valeur?: string;
  type?: string; // EQUIPEMENT, SERVICE, etc.
  icone?: string;
}

export interface Note {
  id?: string;
  valeur?: number;
  commentaire?: string;
  dateCreation?: Date;
}

export interface Bailleur {
  id?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
}

export interface Chambre {
  id?: string;
  numero?: string;
  prix?: number;
  statut?: string; // LIBRE, OCCUPEE, MAINTENANCE
  superficie?: number;
  description?: string;
}

export interface Groupe {
  id?: string;
  nom?: string;
  description?: string;
  chambres?: Chambre[];
}

export interface Cite {
  id?: string;
  name: string;
  description?: string;
  localisation?: Localisation;
  contacts?: Contact[];
  suplements?: Caracteristique[];
  notes?: Note[];
  bailleur?: Bailleur;
  groupes?: Groupe[];
  chambres?: Chambre[];
  created_at?: Date;
  updated_at?: Date;

  // Propriétés calculées pour l'affichage
  rating?: number;
  totalRooms?: number;
  availableRooms?: number;
  status?: string[];
  category?: 'tout' | 'en-construction' | 'securite' | 'meublee';
  price?: {
    amount: number;
    period: string;
  };
  location?: string;
  verified?: boolean;
  image?: string;
  subtitle?: string;
}

export interface CiteDTO {
  id?: string;
  name: string;
  description?: string;
  localisation?: Localisation;
  contactList?: Contact[];
  suplementList?: Caracteristique[];
}

export interface CiteResponse {
  content: Cite[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
