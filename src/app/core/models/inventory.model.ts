// Interface simplificada para evitar importação circular
interface ProductReference {
  id: string;
  code: string;
  name: string;
}

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  lastUpdated: Date;
  
  // Relations
  product?: ProductReference;
}

export interface UpdateInventoryRequest {
  productId: string;
  newQuantity: number;
  notes?: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  type: InventoryTransactionType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  notes?: string;
  reference?: string;
  userId: string;
  transactionDate: Date;
  
  // Relations
  product?: ProductReference;
  user?: any; // Simplified user type
}

export enum InventoryTransactionType {
  ENTRY = 'ENTRADA',
  EXIT = 'SAIDA',
  ADJUSTMENT = 'AJUSTE'
} 