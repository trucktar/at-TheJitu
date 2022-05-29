export interface Student {
  regId: string;
  name: string;
  contactDetails: {
    email: string;
    phone: string;
  };
  course: string;
  balance: number;
}
