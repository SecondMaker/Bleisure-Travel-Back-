export interface PaymentData {
    AccountNumber: string;
    Amount: number;
    BankCode: number;
    ChildClientID?: string | null;
    ClientID: string;
    PhoneNumber: string;
    Reference: number;
    RequestDate?: string | null; // Formato: "yyyy/M/dThh:mm:ss"
}