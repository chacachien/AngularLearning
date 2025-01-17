// models/user.interface.ts
export interface Item {
  STT: string;
  HSD: Date;
  Inventory: number;
}

export interface ItemRow extends Item {
  SL: number;
}

export interface User {
  id: number;          // Unique identifier for each user
  username: string;
  gen: string;
  think: string;
  remember: boolean;
  items: ItemRow[];
  createdAt: Date;    // Track when the user was added
}
