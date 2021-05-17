import { StockOwner } from './stock-owner';

export interface Stock {
  id: number;
  name: string;
  count: number;
  price: number;
  type: 'COMMON' | 'PREFERRED';
  owner: StockOwner;
}

export interface SplitType {
  name: string;
  value: number;
  id: number;
}
