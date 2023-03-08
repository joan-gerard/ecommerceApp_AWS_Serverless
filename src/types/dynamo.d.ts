type ProductId = string;
type ProductGroup = 'electronics' | 'test';
type Category = string;
type Subcategory = string;

export interface ProductsRecord {
  id: ProductId;
  title: string;
  brand: string | null;
  description: string;
  colour?: string;
  sizesAvailable?: {
    sizeCode: number;
    displayValue: string;
  }[];

  pk?: ProductGroup;
  sk?: `${Category}#${ProductId}`;
}

type Timestamp = number;

export interface Order {
  items: {
    id: string;
    count: number;
  }[];
}

export type OrderStatus =
  | 'order_placed'
  | 'warehouse_packed'
  | 'being_delivered'
  | 'delivered'
  | 'error';

export interface OrderRecord {
  id: string;
  pk: string;
  sk: `order#${Timestamp}`;

  userId: string;
  userEmail: string;
  orderCreated: Timestamp;
  warehousePacked?: Timestamp;
  deliveryPicked?: Timestamp;
  status: OrderStatus;

  items: {
    id: ProductId;
    count: number;
    size?: number;
  }[];
}
