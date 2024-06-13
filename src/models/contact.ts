export interface Contact {
  id: number;
  email: string;
  phoneNumber: string;
  linkPrecedence: 'primary' | 'secondary';
  linkedId?: number;
}
