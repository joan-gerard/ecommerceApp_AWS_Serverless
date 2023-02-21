type ProductId = string;
type ProductGroup = 'clothing' | 'climbing' | 'cycling';
type Category = string;
type Subcategory = string;

export interface ProductsRecord {
  id: ProductId;
  pk: ProductGroup;
  sk: `${Category}#${Subcategory}#${ProductId}`;

  title: string;
  description: string;
  colour: string;
  sizesAvailable?: {
    sizeCode: number;
    displayValue: string;
  }[];
}

type Timestamp = number;

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
