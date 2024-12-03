import ProductType, {
  InventoryStatus,
  ProductDataCreateType,
  ProductDataType,
} from "~/types/Product";

import { Product } from "@prisma/client";
import { LOWERSTOCK } from "~/constants";
import { prisma } from "~/db.server";

const mapPrismaProductToAppProduct = (product: Product): ProductType => {
  return {
    ...product,
    category: product.category ?? undefined,
    code: product.code ?? undefined,
    createdAt: product.createdAt?.valueOf(),
    description: product.description ?? undefined,
    image: product.image ?? undefined,
    internalReference: product.internalReference ?? undefined,
    inventoryStatus: product.inventoryStatus as InventoryStatus,
    rating: product.rating ?? undefined,
    shellId: product.shellId ?? undefined,
    updatedAt: product.updatedAt?.valueOf(),
  };
};

class ProductsService {
  static async create(data: ProductDataCreateType): Promise<ProductType> {
    let inventoryStatus: InventoryStatus = "OUTOFSTOCK";
    if (data.quantity) {
      if (data.quantity > LOWERSTOCK) {
        inventoryStatus = "INSTOCK";
      } else {
        inventoryStatus = "LOWSTOCK";
      }
    }
    const newProduct = await prisma.product.create({
      data: {
        ...data,
        inventoryStatus,
        internalReference: "",
      },
    });

    return mapPrismaProductToAppProduct(newProduct);
  }

  static async delete(id: number): Promise<ProductType> {
    const product = await prisma.product.delete({
      where: {
        id,
      },
    });

    return mapPrismaProductToAppProduct(product);
  }

  static async get(): Promise<ProductType[]> {
    const products = await prisma.product.findMany();
    return products.map(mapPrismaProductToAppProduct);
  }

  static async getById(id: number): Promise<ProductType> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Le produit n'existe pas");
    }

    return mapPrismaProductToAppProduct(product);
  }

  static async update(
    id: number,
    data: Partial<ProductDataType>,
  ): Promise<ProductType> {
    const formattedData = { ...data };
    if (data.quantity !== undefined) {
      if (data.quantity > 0) {
        if (data.quantity > LOWERSTOCK) {
          formattedData.inventoryStatus = "INSTOCK";
        } else {
          formattedData.inventoryStatus = "LOWSTOCK";
        }
      } else {
        formattedData.inventoryStatus = "OUTOFSTOCK";
      }
    }

    const product = await prisma.product.update({
      data: formattedData,
      where: { id },
    });

    return mapPrismaProductToAppProduct(product);
  }
}

export default ProductsService;
