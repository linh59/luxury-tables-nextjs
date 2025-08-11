export type UserRole = 'admin' | 'employee';

export type TableStatus = 'empty' | 'eating' | 'processing' | 'paid';



export interface User {
  id: string;
  email?: string;
  username?: string;
  role: UserRole;
  storeId?: string;
  storeName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  permissions?: string[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
}

export interface TableGroup {
  id: string;
  name: string;
  color: string;
}

export interface Table {
  id: string;
  number: string;
  storeId: string;
  groupId: string;
  status: TableStatus;
  amount?: number;
}

export interface Transaction {
  id: string;
  storeId: string;
  storeName: string;
  tableNumber: string;
  amount: number;
  timestamp: Date;
  employeeId: string;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}
