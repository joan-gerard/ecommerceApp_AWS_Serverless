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
  sizeAvailable?: {
    sizeCode: number;
    displayValue: string;
  }[]; 
}
