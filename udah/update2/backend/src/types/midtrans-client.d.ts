declare module 'midtrans-client' {
    export class Snap {
      isProduction: boolean;
      serverKey: string;
  
      constructor(options: { isProduction: boolean; serverKey: string });
      createTransaction(transactionData: any): Promise<any>;
    }
} 