export type UserRole = "seller" | "buyer" | "shipper" | "admin";

export type InvoiceStatus =
  | "DRAFT"
  | "AWAITING_BUYER"
  | "DEPLOYED_OPEN"
  | "LOCKED"
  | "RELEASED"
  | "REVERTED"
  | "CLOSED";

export type ShipmentStatus =
  | "PENDING"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "CUSTOMS"
  | "DELIVERED";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt: string;
  status: InvoiceStatus;
  
  // Parties
  sellerName: string;
  sellerWallet?: string;
  buyerName: string;
  buyerWallet: string;
  agentWallet: string;
  
  // Financial
  amount: string; // 6 decimal places for USDC
  currency: string;
  
  // Goods & Shipment
  goodsDescription: string;
  shipmentDetails: string;
  
  // Contract
  contractAddress?: string;
  transactionHash?: string;
  
  // Documents
  documents: string[];
  
  // Milestones
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  status: ShipmentStatus;
  timestamp: string;
  notes?: string;
  updatedBy?: string;
}

export interface Shipment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  origin: string;
  destination: string;
  currentStatus: ShipmentStatus;
  estimatedDelivery: string;
  milestones: Milestone[];
  trackingNumber: string;
}
