import { Invoice, Shipment } from "./types";

const INVOICES_KEY = "supply_chain_invoices";
const SHIPMENTS_KEY = "supply_chain_shipments";

// Invoice Storage
export const getInvoices = (): Invoice[] => {
  const stored = localStorage.getItem(INVOICES_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
};

export const saveInvoice = (invoice: Invoice): void => {
  const invoices = getInvoices();
  const index = invoices.findIndex((inv) => inv.id === invoice.id);
  
  if (index >= 0) {
    invoices[index] = invoice;
  } else {
    invoices.push(invoice);
  }
  
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
};

export const getInvoiceById = (id: string): Invoice | null => {
  const invoices = getInvoices();
  return invoices.find((inv) => inv.id === id) || null;
};

// Shipment Storage
export const getShipments = (): Shipment[] => {
  const stored = localStorage.getItem(SHIPMENTS_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
};

export const saveShipment = (shipment: Shipment): void => {
  const shipments = getShipments();
  const index = shipments.findIndex((ship) => ship.id === shipment.id);
  
  if (index >= 0) {
    shipments[index] = shipment;
  } else {
    shipments.push(shipment);
  }
  
  localStorage.setItem(SHIPMENTS_KEY, JSON.stringify(shipments));
};

export const getShipmentById = (id: string): Shipment | null => {
  const shipments = getShipments();
  return shipments.find((ship) => ship.id === id) || null;
};
