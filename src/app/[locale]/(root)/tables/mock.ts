
import { Store, Table, TableGroup } from "../../../../../types";

export const MOCK_STORES: Store[] = [
  {id:'store-1', name:'Downtown Restaurant', address:'123 Main St'},
  {id:'store-2', name:'Uptown Bistro', address:'456 Oak Ave'}
];

export const MOCK_TABLES: Table[] = [
 { id: '1', number: '01', storeId: 'store-1', groupId: 'vip', status: 'empty' },
  { id: '2', number: '02', storeId: 'store-1', groupId: 'regular', status: 'eating', amount: 45.50 },
  { id: '3', number: '03', storeId: 'store-1', groupId: 'bar', status: 'processing', amount: 28.75 },
  { id: '4', number: '04', storeId: 'store-1', groupId: 'regular', status: 'paid', amount: 65.20 },
  { id: '5', number: '05', storeId: 'store-2', groupId: 'vip', status: 'empty' },
  { id: '6', number: '06', storeId: 'store-2', groupId: 'regular', status: 'eating', amount: 32.40 },
  { id: '7', number: '07', storeId: 'store-1', groupId: 'regular', status: 'empty' },
  { id: '8', number: '08', storeId: 'store-1', groupId: 'vip', status: 'processing', amount: 89.30 },
  { id: '9', number: '09', storeId: 'store-2', groupId: 'bar', status: 'paid', amount: 56.75 },
  { id: '10', number: '10', storeId: 'store-2', groupId: 'regular', status: 'eating', amount: 42.00 },
];

export const MOCK_GROUPS: TableGroup[] = [
  {id:'all', name:'All Tables', color:'#gray'},
  {id:'vip', name:'VIP', color:'#gold'},
  {id:'regular', name:'Regular', color:'#blue'},
  {id:'bar', name:'Bar', color:'#green'}
];
