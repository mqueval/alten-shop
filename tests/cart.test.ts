import { prisma } from "~/db.server";
import { beforeAll, expect } from "vitest";
import { URL_API } from "~/constants";
import CartsService from "~/services/CartsService.server";
import UsersService from "~/services/UsersService.server";
import ProductsService from "~/services/ProductsService.server";

beforeAll(async () => {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
});

describe("panier", () => {
  it("Carts.addToCartForUser", async () => {
    const user = await UsersService.create({
      username: "demo",
      email: "demo@email.fr",
      firstname: "demo",
      password: "123",
    });
    const product = await ProductsService.create({
      name: "Produit A",
      price: 200,
      quantity: 1,
    });

    const data = {
      quantity: 1,
    };

    const result = await CartsService.addToCartForUser(
      user.id,
      product.id,
      data.quantity,
    );

    expect(result?.userId).toBe(user.id);
  });

  it("/api/cart/add USER", async () => {
    const password = "123";
    const user = await UsersService.create({
      password,
      username: "demo23",
      email: "demo23@email.fr",
      firstname: "demo",
    });

    const token = await UsersService.login(user.email, password);
    const product = await ProductsService.create({
      name: "Produit C",
      price: 200,
      quantity: 1,
    });

    const formData = new FormData();
    formData.append("productId", product.id.toString());
    formData.append("quantity", "1");

    const response = await fetch(URL_API + "/cart/add", {
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
    });
    const { success, data } = await response.json();
    expect(success).toBe(true);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
