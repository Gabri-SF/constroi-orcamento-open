export interface CompanyData {
  name: string;
  nif: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
}

export interface ClientData {
  name: string;
  nif: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
}

export interface BudgetItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  items: BudgetItem[];
  total: number;
}

export interface Budget {
  companyData: CompanyData;
  clientData: ClientData;
  categories: BudgetCategory[];
  hasVAT: boolean;
  vatPercentage: number;
  conditions: string;
  notIncluded: string;
  location: string;
  issueDate: string;
  subtotal: number;
  vatAmount: number;
  total: number;
}

export interface SavedBudget extends Budget {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetListItem {
  id: string;
  name: string;
  clientName: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}
