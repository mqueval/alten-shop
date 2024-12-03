import { ActionFunction, LoaderFunction } from "@remix-run/node";

import ProductsService from "~/services/ProductsService.server";

export const loader: LoaderFunction = async ({}) => {
  try {
    const products = await ProductsService.get();

    return Response.json({
      data: products,
      success: true,
    });
  } catch (error) {
    return Response.json({
      message: (error as Error).message,
      success: false,
    });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const name = formData.get("name");
  if (!name || typeof name !== "string") {
    throw new Response("Le nom est obligatoire");
  }
  const price = formData.get("price");
  if (!price || typeof price !== "string" || price === "") {
    throw new Response("Le prix est obligatoire");
  }
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) {
    throw new Response("Le format du prix n'est pas correct");
  }

  const description =
    formData.get("description") &&
    typeof formData.get("description") === "string"
      ? (formData.get("description") as string)
      : undefined;

  const category =
    formData.get("category") !== null &&
    typeof formData.get("category") === "string"
      ? (formData.get("category") as string)
      : undefined;

  const quantity =
    formData.get("quantity") !== null &&
    typeof formData.get("quantity") === "string" &&
    formData.get("quantity") !== ""
      ? parseInt(formData.get("quantity") as string, 10)
      : 0;

  if (quantity !== undefined && isNaN(quantity)) {
    throw new Response("Le format de la quantité n'est pas correct");
  }

  const product = await ProductsService.create({
    category,
    description,
    name,
    quantity,
    price: parsedPrice,
  });

  return Response.json({
    data: product,
    success: true,
  });
};
