export type ProductDataCreateType = Omit<
  ProductDataType,
  "createdAt" | "inventoryStatus" | "updatedAt"
>;

export type InventoryStatus = "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";

export interface ProductDataType {
  name: string;
  description?: string;
  category?: string;
  code?: string;
  image?: string;
  internalReference?: string;
  inventoryStatus: InventoryStatus;
  price: number;
  quantity: number;
  rating?: number;
  shellId?: number;
}

interface ProductType extends ProductDataType {
  createdAt: number;
  id: number;
  updatedAt: number;
}

export default ProductType;
