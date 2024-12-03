import { prisma } from "~/db.server";
import { beforeAll, expect } from "vitest";
import ProductsService from "~/services/ProductsService.server";
import { URL_API } from "~/constants";

beforeAll(async () => {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
});

describe("produit", () => {
  it("ProductService.create", async () => {
    const data = {
      name: "Produit A",
      price: 200,
      quantity: 1,
    };
    const product = await ProductsService.create(data);

    expect(product.name).toBe(data.name);
  });

  it("api/products CREATE", async () => {
    const data = {
      name: "Produit B",
      price: 100,
    };
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", String(data.price));

    const response = await fetch(URL_API + "/products", {
      body: formData,
      method: "POST",
    });
    const { success, data: product } = await response.json();

    expect(success).toBe(true);
    expect(product.name).toBe(data.name);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
