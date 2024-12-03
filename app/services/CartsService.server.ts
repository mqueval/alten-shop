import { prisma } from "~/db.server";
import { Session, SessionData } from "@remix-run/node";
import CartType from "~/types/Cart";
import ProductsService from "~/services/ProductsService.server";

class CartsService {
  static async addToCartForUser(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<CartType | null> {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingCartItem) {
      // Met à jour la quantité du produit existant
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity <= 0) {
        // il faut le supprimer
        await prisma.cartItem.delete({
          where: { id: existingCartItem.id },
        });
      } else {
        await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: newQuantity },
        });
      }
    } else {
      // Ajoute un nouvel item au panier
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return CartsService.getCartForUser(userId);
  }

  static async addToCartForGuest(
    session: Session<SessionData, SessionData>,
    productId: number,
    quantity: number,
  ) {
    const cart: CartType = session.get("cart") || {
      items: [],
    };
    const index = cart.items.findIndex((item) => item.productId === productId);

    if (index >= 0) {
      const existingItem = cart.items[index];
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= 0) {
        cart.items.splice(index, 1);
      } else {
        existingItem.quantity = newQuantity;
      }
    } else {
      const product = await ProductsService.getById(productId);
      cart.items.push({
        product,
        quantity,
        productId: productId,
      });
    }

    session.set("cart", cart);

    return cart;
  }

  static async getCartForUser(userId: number): Promise<CartType> {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return cart as unknown as CartType;
  }

  static async removeToCartForUser(
    userId: number,
    productId: number,
  ): Promise<CartType | null> {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return null;
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!existingCartItem) {
      return null;
    }

    await prisma.cartItem.delete({
      where: { id: existingCartItem.id },
    });

    return CartsService.getCartForUser(userId);
  }

  static async removeToCartForGuest(
    session: Session<SessionData, SessionData>,
    productId: number,
  ) {
    const cart: CartType = session.get("cart") || {
      items: [],
    };
    const index = cart.items.findIndex((item) => item.productId === productId);

    if (index >= 0) {
      cart.items.splice(index, 1);
    }

    session.set("cart", cart);

    return cart;
  }
}

export default CartsService;
