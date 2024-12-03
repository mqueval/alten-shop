import { ActionFunction, LoaderFunction } from "@remix-run/node";

import ProductsService from "~/services/ProductsService.server";
import ProductType from "~/types/Product";

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id && parseInt(params.id, 10);
  if (!id || isNaN(id)) {
    throw new Response("L'identifiant du produit n'existe pas");
  }
  let product: ProductType;
  try {
    product = await ProductsService.getById(id);

    return Response.json({
      data: product,
      success: true,
    });
  } catch (error) {
    return Response.json({
      message: (error as Error).message,
      success: false,
    });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.id ? parseInt(params.id, 10) : undefined;
  if (!id || isNaN(id)) {
    throw new Response("L'identifiant du produit est obligatoire");
  }

  switch (request.method) {
    case "DELETE": {
      const product = await ProductsService.delete(id);

      return Response.json({ data: product, success: true });
    }

    case "PATCH": {
      const formData = await request.formData();
      const name = formData.get("name");
      if (typeof name !== "string") {
        throw new Response("Le nom est doit être un string");
      }

      const price =
        typeof formData.get("price") === "string"
          ? parseFloat(formData.get("price") as string)
          : undefined;
      if (price && isNaN(price)) {
        throw new Response("Le format du prix n'est pas correct");
      }

      const description =
        formData.get("description") &&
        typeof formData.get("description") === "string"
          ? (formData.get("description") as string)
          : undefined;

      const category =
        formData.get("category") && typeof formData.get("category") === "string"
          ? (formData.get("category") as string)
          : undefined;

      const quantity =
        typeof formData.get("quantity") === "string" &&
        formData.get("quantity") !== ""
          ? parseInt(formData.get("quantity") as string, 10)
          : undefined;
      if (quantity && isNaN(quantity)) {
        throw new Response("Le format de la quantité n'est pas correct");
      }

      const product = await ProductsService.update(id, {
        category,
        description,
        name,
        quantity,
        price,
      });

      return Response.json({ data: product, success: true });
    }

    default:
      return Response.json({
        message: "Cette méthode n'est pas prise en charge",
        success: false,
      });
  }
};
