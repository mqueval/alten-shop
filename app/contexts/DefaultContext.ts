import CartType from "~/types/Cart";

interface DefaultContextType {
  addToCart: (productId: number, quantity: number) => void;
  cart: CartType;
  removeFromCart: (productId: number) => void;
}

export default DefaultContextType;
