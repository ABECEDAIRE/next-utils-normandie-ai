export interface Record {
  id: string;
  createdTime: string; // ISO8601 date string
  fields: Fields;
}

export enum RelanceStatus {
  toRelance = "toRelance",
  error = "error",
  relanced = "relanced",
  canceled = "canceled",
}

export type RecordList = {
  records: RecordItem[];
};

type RecordItem = {
  id: string;
  createdTime: string;
  fields: Fields;
};

type Fields = {
  "N° de commande": string;
  "Date de la commande": string; // ISO8601 date string
  "Prénom du participant": string;
  "Nom de famille du participant": string;
  "Courriel du participant": string;
  "Numéro de téléphone": string;
  "Ville de l'acheteur": string;
  "État/province de l'acheteur": string;
  "Pays de l'acheteur": string;
  "Nom de l'événement": string;
  "No d'identification de l'événement": number;
  "Date de début de l'événement": string; // ISO8601 date string (YYYY-MM-DD format)
  "Heure de début de l'événement": string; // Time string (HH:mm:ss format)
  "Fuseau horaire de l'événement": string;
  "Lieu de l'événement": string;
  "Nombre de billets": number;
  "Type de billet": ticketType;
  "Information Ticket": string;
  Devise: string;
  "Prix du billet": number;
  "Prénom de l'acheteur": string;
  "Nom de famille de l'acheteur": string;
  "Courriel de l'acheteur": string;
  numbercodebarres: Barcode;
  relanceStatus: string;
  visite: visitStatus;
  lastVisited: string; // ISO8601 date string
};

export enum visitStatus {
  noshow = "noshow",
  visited = "visited",
  new = "new",
}

export enum ticketType {
  pro = "Normandie.ai // Ticket d'accès professionnel",
  student = "Normandie.ai // Ticket d'accès étudiant",
  vip = "Normandie.ai // Ticket d'accès VIP",
  special = "Normandie.ai //  Ticket Spécial",
}
type Barcode = {
  text: string;
};
