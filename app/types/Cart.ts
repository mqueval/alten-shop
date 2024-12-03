import ProductType from "~/types/Product";

export type CartItemType = {
  id?: number;
  productId: number;
  product: ProductType;
  quantity: number;
};

interface CartDataType {
  items: CartItemType[];
  userId: number;
}
interface CartType extends CartDataType {
  createdAt: number;
  id: number;
  updatedAt: number;
}

export default CartType;
